const reminderModel = require('../models/reminderList')

const getReminders = async (req, res, next) => {
  const email = req.query.email;

  try {
    // Find the user by email
    const existingUser = await reminderModel.findOne({ email });

    // Check if the user exists and has reminders
    if (existingUser && existingUser.reminders) {
      // Sort reminders by reminderDate in ascending order
      const sortedReminders = existingUser.reminders.sort((a, b) => {
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return new Date(`${year}-${month}-${day}`);
        };

        return parseDate(a.reminderDate) - parseDate(b.reminderDate);
      });

      // console.log(sortedReminders)

      res.status(200).json({ reminders: sortedReminders});
    } else {
      res.status(200).json({ reminders: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching reminders" });
  }
};


const changeReminderStatus = async (req, res, next) => {
  const tId  = req.query.tId;
  // console.log(tId);
  const email = req.query.email
  //   console.log(email);
  const existingUser = await reminderModel.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const transaction = existingUser.reminders.find(
    (t) => t._id.toString() === tId
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Toggle the isActive field of the transaction
  transaction.isActive = !transaction.isActive;

  // Save the updated user document back to the database
  await existingUser.save();

  // Send success response
  return res.status(200).json({ message: "Reminder status updated", transaction });

}

module.exports = { getReminders, changeReminderStatus };