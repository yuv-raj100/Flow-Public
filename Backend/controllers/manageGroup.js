const userModel = require("../models/userCustomers");
const ErrorHandler = require("../utils/errorHandler");
const transactionModel = require("../models/customerTransactionDetails")
const mongoose = require("mongoose");
const reminderModel = require('../models/reminderList')


const addCustomer = async (req, res) => {
  
  const { customerName, email, isDue, amount, date } = req.body;

  // Validate required fields
  if (!customerName || !email || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newCustomer = {
    customerName: customerName,
    isDue: isDue,
    amount: amount,
    date: date,
    reminder: date, // Assuming the reminder is set to the same date initially
  };

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add new customer to the customer's list
    user.customerList.push(newCustomer);

    // Save the user and retrieve the last added customer
    const savedUser = await user.save();
    const addedCustomer =
      savedUser.customerList[savedUser.customerList.length - 1];

    // Create a new transaction entry for the added customer
    const newCustomerTransaction = new transactionModel({
      customerName: addedCustomer.customerName,
      customerId: addedCustomer._id,
      customerTransaction: [], // Initialize with an empty array
    });

    // Save the transaction record
    await newCustomerTransaction.save();

    // Send success response with added customer details
    return res.status(201).json({
      message: "Customer added successfully",
      customer: addedCustomer,
    });
  } catch (err) {
    console.error("Error adding customer:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteGroup = async (req, res) => {
  try {
    const { customerId, email } = req.params;

    // Find the customer in the user model
    const customer = await userModel.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert customerId to ObjectId
    const customerObjectId = new mongoose.Types.ObjectId(customerId);

    // Save the initial length to check if deletion was successful
    const initialLength = customer.customerList.length;

    // Filter out the customer to be deleted
    customer.customerList = customer.customerList.filter(
      (cust) => !cust._id.equals(customerObjectId)
    );

    // Check if the customer was found and removed
    if (initialLength === customer.customerList.length) {
      return res
        .status(404)
        .json({ message: "Customer not found in the list" });
    }

    // Save the updated user after removal of the customer
    await customer.save();

    // Delete the transactions associated with the customer
    const transactionResult = await transactionModel.deleteOne({ customerId });

    // Delete the reminders associated with the customer
    const reminderResult = await reminderModel.updateOne(
      { email }, // Find the reminder list for the user
      { $pull: { reminders: { customerId } } } // Remove all reminders with the customerId
    );

    // Check if the transaction was deleted
    if (
      transactionResult.deletedCount > 0 &&
      reminderResult.modifiedCount > 0
    ) {
      return res
        .status(200)
        .json({
          message: "Customer, transaction, and reminders successfully deleted",
        });
    } else if (transactionResult.deletedCount > 0) {
      return res
        .status(200)
        .json({
          message: "Customer and transaction deleted, but no reminders found",
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Customer deleted, but no transactions or reminders found",
        });
    }
  } catch (error) {
    console.error("Error deleting customer group:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getCustomers = async (req, res, next) => {
  try {
    const email = req.query.email;
    console.log(email);
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const customerList = existingUser.customerList;
    const updatedCustomers = await Promise.all(
      customerList.map(async (customer) => {
        const userTransaction = await transactionModel.findOne({
          customerId: customer._id,
        });

        if (userTransaction && userTransaction.customerTransaction.length > 0) {
          // Sort the transactions by reminderDate
          const sortedTransactions = userTransaction.customerTransaction.sort(
            (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate)
          );

          // Set the earliest reminder date
          customer.reminder = sortedTransactions[0].reminderDate;
        }

        return customer;
      })
    );

    // Update the user with the updated customer list
    existingUser.customerList = updatedCustomers;
    await existingUser.save();

    // Send the updated customer list in the response
    return res.status(200).json({ customers: existingUser.customerList });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// const searchUser = async (req, res, next) => {
  
//   const { query } = req.query;
//   try {
//     const results = await userModel.find({
//       username: new RegExp(query, "i"),
//     });
//     res.status(201).json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getUsers = async (req,res,next) => {
//     const groupId = req.query.groupId;
//     console.log(groupId);
//     const groupInfo = await groupModel.findOne({groupId:groupId});
//     res.status(201).json({userList:groupInfo.userList});
// }

module.exports = {addCustomer, getCustomers, deleteGroup};
