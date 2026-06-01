import mogoose from 'mongoose';

const connectDB = async () => {
  try {
    mogoose.connection.on('connected', () => {
      console.log('Database connection established');
    });
    await mogoose.connect(`${process.env.MONGODB_URI}/asknova`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

export default connectDB;