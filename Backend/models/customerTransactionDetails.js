const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  customerId: String,
  createdOn:String,
  desc:String,
  reminderDate:String,
  amount:String,
  date:String,
  customerName:String,
  isReceived:Boolean,
  email:String,
  isRemind:Boolean,
});


const customerTransactionSchema = new mongoose.Schema({
  customerName: {
    type: String,
  },

  customerId: {
    type: String,
  },

  customerTransaction: {
    type: [transactionSchema],
  },

});

module.exports = mongoose.model("customerTransactionList", customerTransactionSchema);