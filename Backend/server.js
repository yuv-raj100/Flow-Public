const express = require("express");
const http = require("http"); // Add this line
const WebSocket = require("ws"); // Add this line
const mongoose = require("mongoose");
const reminderModel = require("./models/reminderList"); // Import your schema
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const connectDB = require("./db/connect");
const errorMiddleware = require("./middlewares/Error");
const mainRouter = require("./routes/route");

const {sendNotification} = require('./firebase/index')

const app = express();
app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api", mainRouter);

const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   // Variable to store email once received
//   let clientEmail = null;

//   // Handle incoming messages from the client
//   ws.on("message", async (message) => {
//     try {
//       const data = JSON.parse(message);

//       if (data.type === "setEmail") {
//         clientEmail = data.email;
//         console.log(`Email received: ${clientEmail}`);
//         checkReminders(clientEmail);
//       } else {
//         console.log("Unknown message type:", data.type);
//       }
//     } catch (error) {
//       console.error("Error parsing message:", error);
//     }
//   });

//   const checkReminders = async (email) => {
//     try {
//       console.log("working");
//       const currentDateFormat = new Date();
//       const formattedDate = currentDateFormat.toLocaleDateString("en-GB");
//       const formattedDateWithHyphens = formattedDate.split("/").join("-");
//       const currentDate = formattedDateWithHyphens; // Get current date in YYYY-MM-DD format
//       console.log(`Checking reminders for ${email} on ${currentDate}`);

//       const reminders = await reminderModel.findOne(
//         {
//           email,
//           "reminders.reminderDate": currentDate,
//         },
//         {
//           "reminders.$": 1, // Project only the matching reminders
//         }
//       );

//       if (reminders && reminders.reminders.length > 0) {
//         console.log("Reminder found");
//         ws.send(
//           JSON.stringify({ hasReminder: true, reminders: reminders.reminders })
//         );
//       } else {
//         ws.send(JSON.stringify({ hasReminder: false }));
//       }
//     } catch (error) {
//       console.error("Error checking reminders:", error);
//     }
//   };

//   // Set interval to check reminders every minute (60000 ms)
//   const interval = setInterval(() => {
//     if (clientEmail) {
//       checkReminders(clientEmail);
//     }
//   }, 60000);

//   // Clean up when the connection closes
//   ws.on("close", () => {
//     console.log("Client disconnected");
//     clearInterval(interval); // Stop checking reminders when client disconnects
//   });
// });

app.get("/", (req, res) => {
  res.send("Hello");
});



// const sendNotificaion = async ()=>{
//   await firebase.messaging().send({
//     token:
//       "f2TaNwl_TW-IEXc8EQRmNV:APA91bEscvd5RqLsZ881pPw0dw98OsEPhRfLsgS424cEv6C8rFrP6PT7gMkjuvg81LnbuUJ9og9eIGQcU3w3t1nKOeJcNzn_XaHaKHjCeQh73IN9fIdBx_4",
//     notification: {
//       title: "Hello",
//       body: "tji",
//     },
//   });
// }

// setInterval(async () => {
//   try {
//     await sendNotification("raj@123");
//     console.log("Notification sent successfully!");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// }, 60000);

// const interval = setInterval(async () => {
//   try {
//     await sendNotification();
//     console.log("Notification sent successfully!");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// }, 60000);


const start = async () => {
  try { 
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () =>{
      console.log(`server is running on port ${PORT} and connected to DB`)
    }
    );
  } catch (error) {
    console.log(error);
  }
};

app.use(errorMiddleware);

start();


