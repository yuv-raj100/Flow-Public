const userModel = require("../models/userCustomers");
const ErrorHandler = require("../utils/errorHandler");
const transactionModel = require("../models/customerTransactionDetails");
const mongoose = require("mongoose");
const reminderModel = require("../models/reminderList");

const addTransaction = async (req, res) => {
  try {
    // Destructure the request body
    const {
      customerId,
      createdOn,
      amount,
      date,
      desc,
      customerName,
      reminderDate,
      isReceived,
      email,
      remindMe,
    } = req.body;

    // Validation: Ensure required fields are provided
    if (!customerId || !email || !amount || !date || !customerName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new transaction object
    let newTransaction = {
      customerName,
      createdOn,
      amount,
      date,
      desc,
      reminderDate,
      isReceived,
      customerId,
      email,
      isActive: remindMe,
      isRemind: remindMe,
    };

    // Fetch the transaction document for the customer
    const userTransaction = await transactionModel.findOne({ customerId });

    if (!userTransaction) {
      return res
        .status(404)
        .json({ message: "Customer not found in transaction list" });
    }

    // Add the new transaction to the customerTransaction list
    userTransaction.customerTransaction.push(newTransaction);

    // Save the transaction to generate _id
    const savedTransaction = await userTransaction.save();

    // Get the _id of the newly inserted transaction
    const generatedTransactionId =
      savedTransaction.customerTransaction[
        savedTransaction.customerTransaction.length - 1
      ]._id;

    // Update newTransaction with the generated _id
    newTransaction = { ...newTransaction, transactionId: generatedTransactionId };

    // Handle reminders if 'remindMe' is set to true
    if (remindMe) {
      const userReminder = await reminderModel.findOne({ email });

      if (userReminder) {
        userReminder.reminders.push(newTransaction);
        await userReminder.save();
      } else {
        console.log("Reminder user not found, skipping reminder");
      }
    }

    // Update userModel for the customer's balance and isDue status
    const userCustomer = await userModel.findOne({ email });
    if (!userCustomer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the customer in the customer's list
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const customer = userCustomer.customerList.find((cust) =>
      cust._id.equals(customerObjectId)
    );

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found in customerList" });
    }

    // Update the customer's balance
    const transactionAmount = parseFloat(amount);
    if (isReceived) {
      customer.amount = (
        parseFloat(customer.amount) + transactionAmount
      ).toString();
    } else {
      customer.amount = (
        parseFloat(customer.amount) - transactionAmount
      ).toString();
    }

    // Update isDue flag based on the balance
    customer.isDue = parseFloat(customer.amount) < 0;

    // Save the updated user data
    await userCustomer.save();

    // Return success response
    return res.status(201).json({ message: "Transaction added successfully" });
  } catch (err) {
    console.error("Error adding transaction:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const deleteTransaction = async (req, res, next) => {
  try {
    const { customerId, transactionId, email } = req.params;
    // console.log(transactionId)

    // Find the customer in the transaction model
    const customer = await transactionModel.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const transactionObjectId = new mongoose.Types.ObjectId(transactionId);
    const initialLength = customer.customerTransaction.length;

    // Find the transaction in the customer's transaction list
    const transaction = customer.customerTransaction.find((transac) =>
      transac._id.equals(transactionObjectId)
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Remove the transaction from the customer's transaction list
    customer.customerTransaction = customer.customerTransaction.filter(
      (transac) => !transac._id.equals(transactionObjectId)
    );
    await customer.save();

    // Update the user's customer list in userModel
    const userCustomer = await userModel.findOne({ email });

    if (userCustomer) {
      const customerObjectId = new mongoose.Types.ObjectId(customerId);
      const customerNew = userCustomer.customerList.find(cust =>
        cust._id.equals(customerObjectId)
      );

      if (customerNew) {
        const transactionAmount = parseFloat(transaction.amount);
        if (transaction.isReceived) {
          customerNew.amount = (parseFloat(customerNew.amount) - transactionAmount).toString();
        } else {
          customerNew.amount = (parseFloat(customerNew.amount) + transactionAmount).toString();
        }
        customerNew.isDue = parseFloat(customerNew.amount) < 0;
        await userCustomer.save();
      } else {
        console.log("Customer not found in customerList");
      }
    } else {
      console.log("User not found");
    }

    // Check if the transaction is in the reminder list and remove it
    const userReminder = await reminderModel.findOne({ email });
    if (userReminder) {
      const reminderInitialLength = userReminder.reminders.length;

      userReminder.reminders = userReminder.reminders.filter(
        (reminder) => reminder.transactionId !== transactionId
      );

      // If the transaction was in the reminder list, save the changes
      if (reminderInitialLength !== userReminder.reminders.length) {
        await userReminder.save();
      }
      else{
        console.log("error");
      }
    }

    // If the transaction was not found in the customerTransaction list
    if (initialLength === customer.customerTransaction.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "An error occurred while deleting the transaction" });
  }
};


const getTransactions = async (req, res) => {
  try {
    const customerId = req.query.customerId;

    // Check if customerId is provided
    if (!customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

    // Fetch the transactions for the given customerId
    const existingUser = await transactionModel.findOne({ customerId });

    // Check if transactions are found for the given customerId
    if (existingUser && existingUser.customerTransaction.length > 0) {
      return res.status(200).json({
        transactions: existingUser.customerTransaction,
      });
    } else {
      return res.status(404).json({ message: "Customer not found or no transactions available." });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// const getUsers = async (req,res,next) => {
//     const groupId = req.query.groupId;
//     console.log(groupId);
//     const groupInfo = await groupModel.findOne({groupId:groupId});
//     res.status(201).json({userList:groupInfo.userList});
// }

module.exports = { getTransactions, addTransaction, deleteTransaction };
