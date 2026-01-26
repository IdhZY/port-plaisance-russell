const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Test:Abcdef@cluster0.khr00s6.mongodb.net/?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
