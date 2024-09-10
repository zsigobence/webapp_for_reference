
const mongoose = require('mongoose');

require('dotenv').config(); 


const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  }
};



  const taskSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
      type:Boolean,
      required:true
    },
    editing:{
        type:Boolean,
        required:true
      },
    isToday:{
        type:Boolean,
        required:true
        }
  });



const taskCollection=mongoose.model('taskCollection',taskSchema)



module.exports={ connectDB,taskCollection }