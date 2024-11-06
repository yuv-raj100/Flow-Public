const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  customerId: String,
  createdOn: String,
  desc: String,
  reminderDate: String,
  amount: String,
  date: String,
  customerName: String,
  isReceived: Boolean,
  isActive:Boolean,
  transactionId:String,
});

const reminderListSchema = mongoose.Schema({
  email: {
    type: String,
  },

  reminders: {
    type: [reminderSchema],
  },
});



module.exports = mongoose.model("ReminderList", reminderListSchema);
