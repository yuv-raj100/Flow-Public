const firebase = require("firebase-admin");
const reminderModel = require("../models/reminderList");
const Token = require('../models/tokenSchema');
require("dotenv").config();

const serviceAccount = {
  type: process.env.GOOGLE_TYPE || "service_account", // Add if necessary
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const saveToken  = async (req, res) => {
  const { token, device } = req.body;
  console.log(device);
  const userId=device;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Find the document by userId and update the token, or create a new one if it doesn't exist
    const updatedToken = await Token.findOneAndUpdate(
      { userId }, // Find by userId if you want each user to have a unique token
      { token, userId }, // Update or set the token
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options: create if not found, return new document
    );

    res.status(200).json({
      message: "Token registered or updated successfully",
      token: updatedToken,
    });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const sendNotification = async (req, res) => {
  const email="raj@123";
  try {
    const currentDateFormat = new Date();
    const formattedDate = currentDateFormat.toLocaleDateString("en-GB");
    const formattedDateWithHyphens = formattedDate.split("/").join("-");
    const currentDate = formattedDateWithHyphens; // Get current date in YYYY-MM-DD format

    console.log(`Checking reminders on ${currentDate}`);

    // Fetch all users
    const users = await Token.find(); // Assuming you have a User model

    // Iterate over each user to send notifications
    for (const user of users) {
      const userId = user.userId; // Get the user's userId
      const tokenRecord = await Token.findOne({ userId }); // Find the token for this user

      if (!tokenRecord) {
        console.error(`No token found for user: ${userId}`);
        continue; // Skip to the next user if no token found
      }

      const userToken = tokenRecord.token;
      console.log(`Sending notification to token: ${userToken}`);

      // Fetch reminders for the user based on userId (adjust your query accordingly)
      const reminders = await reminderModel.findOne(
        {
          email, // Assuming reminders are stored with userId
        },
        {
          reminders: {
            $filter: {
              input: "$reminders",
              as: "reminder",
              cond: { $eq: ["$$reminder.reminderDate", currentDate] },
            },
          },
        }
      );

      // Send notifications based on reminders
      if (reminders && reminders.reminders.length > 0) {
        for (const reminder of reminders.reminders) {
          await firebase.messaging().send({
            token: userToken,
            notification: {
              title: "Reminder Alert",
              body: `Reminder for ${reminder.customerName} on ${reminder.reminderDate}. Amount: ₹${reminder.amount}`,
            },
            android: {
              priority: "high",
              notification: {
                sound: "default",
              },
            },
          });
        }
      } else {
        // No reminders for the user today
        await firebase.messaging().send({
          token: userToken,
          notification: {
            title: "Reminder",
            body: "No reminders today.",
          },
          android: {
            priority: "high",
            notification: {
              sound: "default",
            },
          },
        });
      }
    }

    res.send("Notifications sent successfully.");
  } catch (error) {
    console.error("Error checking reminders:", error);
    res.status(500).send("Error sending notifications.");
  }
};




module.exports = {sendNotification,saveToken}