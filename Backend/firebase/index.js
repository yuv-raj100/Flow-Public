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

const saveToken = async (req, res) => {
  const { token, device, email } = req.body;
  const userId = device;
  // console.log("email"+email)
  if (!token || !email || !userId) {
    return res.status(400).json({ message: "Token, device, and email are required" });
  }

  try {
    // Find the document by email and update the token and userId, or create a new one if it doesn't exist
    const updatedToken = await Token.findOneAndUpdate(
      { email }, // Find by email to ensure the email remains unique
      { token, userId, email }, // Update token and userId
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options to create if not found
    );

    // console.log(updatedToken)

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
  try {
    const currentDateFormat = new Date();
    const formattedDate = currentDateFormat.toLocaleDateString("en-GB");
    const formattedDateWithHyphens = formattedDate.split("/").join("-");
    const currentDate = formattedDateWithHyphens; // Current date in DD-MM-YYYY format

    console.log(`Checking reminders on ${currentDate}`);

    // Fetch all users from Token model
    const users = await Token.find();

    for (const user of users) {
      const { email, token: userToken, userId } = user;

      // Skip users without a token
      if (!userToken) {
        console.error(`No token found for user: ${userId}`);
        continue;
      }

      console.log(`Checking reminders for user: ${email}`);

      // Find reminders due today for the specific user
      const reminders = await reminderModel.findOne(
        { email }, // Filter reminders by user email
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

      // Check if there are reminders to notify
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
          console.log(
            `Notification sent to ${email} for reminder: ${reminder.customerName}`
          );
        }
      } else {
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

    res.send("Notifications sent successfully to users with reminders.");
  } catch (error) {
    console.error("Error checking reminders:", error);
    res.status(500).send("Error sending notifications.");
  }
};




module.exports = {sendNotification,saveToken}