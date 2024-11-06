const router = require('express').Router();

const { addCustomer, getCustomers, deleteGroup} = require('../controllers/manageGroup');
const { getReminders, changeReminderStatus } = require('../controllers/manageReminders');
const { addTransaction, getTransactions, deleteTransaction} = require('../controllers/manageTransactions');
const {login, register} = require('../controllers/userControllers');
const { saveToken, sendNotification } = require('../firebase/index');



router.post('/login',login)
router.post('/register',register)
router.post('/addCustomer',addCustomer)
router.get('/getCustomer',getCustomers)
router.post('/addTransaction',addTransaction)
router.get('/getTransaction',getTransactions)
router.delete("/deleteTransaction/:customerId/:transactionId/:email",deleteTransaction);
router.get("/getReminders",getReminders);
router.delete('/deleteUser/:email/:customerId',deleteGroup)
router.get('/toggleReminder',changeReminderStatus)
router.post("/registerToken", saveToken);
router.get("/getNotification", sendNotification);
// router.get('/getGroups',getGroups)
// router.get('/search',searchUser)
// router.post('/addGroup',addGroup)
// router.get('/getUsers',getUsers)


module.exports = router;