const userModel = require("../models/userDetails");
const customerModel = require("../models/userCustomers");
const reminderModel = require('../models/reminderList')
// const groupModel = require('../models/userGroupList')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ErrorHandler = require('../utils/errorHandler')

const register = async (req, res, next) => {
  const { username, email } = req.body;
  // console.log(email);
  // console.log(email);
  try {
    const existingUser = await userModel.findOne({ email: email });
    console.log(existingUser)
    if (existingUser) {
        res.status(201).json({ message:"Success" });
        return;
    }

    const result = await userModel.create({
      username: username,
      email: email,
    });
    console.log(result);
    const userCustomerCreation = await customerModel.create({
      email: email,
      customerList: [],
    });

    const reminderCustomerCreation = await reminderModel.create({
      email: email,
      reminders: [],
    })

    res.status(201).json({ user: result});
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// const login = async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(email);

//   try {
//     const existingUser = await userModel.findOne({ email: email });
//     if (!existingUser) {
//       return next(new ErrorHandler("User Not Found",404));
//     }

//     const matchPassword = await bcrypt.compare(password, existingUser.password);

//     if (!matchPassword) {
//       return next(new ErrorHandler("Invalid Credentials",400));
//     }

//     const token = jwt.sign(
//       { email: existingUser.email },
//       process.env.SECRET_KEY
//     );
//     res.status(201).json({ token: token, email:email });
//   } catch (error) {
//     console.log(error);
//      return next(error);
//   }
// };


// const searchUser = async (req,res,next) => {
//   const { query } = req.query;
//   try {
//     const results = await userModel.find({
//       username: new RegExp(query, "i"),
//     });
//     res.status(201).json(results);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// const profile = async (req, res) => {
//   const { token } = req.body;
//   const decoded = jwt.decode(token);
//   const existingUser = await userModel.findOne({ email: decoded.email });
//   res
//     .status(201)
//     .json({ email: existingUser.email, username: existingUser.username });
// };

module.exports = { register };
