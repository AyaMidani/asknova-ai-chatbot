import Transaction from "../models/Transaction.js"

const plans =[
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

//API Controller for fetching all plans
export const getPlans = (req, res) => {
    try {
        res.status(200).json({ success: true, plans })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//API Controller for purchasing a plan
export const purchasePlan = (req, res) => {
    try {
        const { planId } = req.body
        const userId = req.user._id 
        const plan = plans.find(p => p._id === planId)
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" })
        }
        const transaction = Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid : false,
        })
        // Here you would typically integrate with a payment gateway and update the user's credits in the database
        res.status(200).json({ success: true, message: `You have successfully purchased the ${plan.name} plan!`, creditsAdded: plan.credits })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}