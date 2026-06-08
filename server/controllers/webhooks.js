import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const stripeWebhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const { transactionId, appId } = session.metadata;

                console.log('Session metadata:', session.metadata);

                if (appId === 'asknova') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });

                    console.log('Transaction found:', transaction);

                    if (!transaction) {
                        console.log('Transaction not found or already paid');
                        return res.status(400).json({ received: true, message: 'Transaction not found' });
                    }

                    const updateResult = await User.updateOne(
                        { _id: transaction.userId },
                        { $inc: { credits: transaction.credits } }
                    );

                    console.log('User update result:', updateResult);

                    transaction.isPaid = true;
                    await transaction.save();
                } else {
                    console.log('Ignored event for non asknova app');
                    return res.status(400).json({ received: true, message: 'Ignored event for non asknova app' });
                }
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Error processing webhook event:', err);
        res.status(500).send('Internal Server Error');
    }
};