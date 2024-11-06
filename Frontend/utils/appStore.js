import { configureStore } from "@reduxjs/toolkit";
import usersSliceReducers from './usersSlice'
import transactionSliceReducers from './transactionSlice'
import reminderSliceReducers from './reminderSlice'

const appStore = configureStore({
  reducer: {
    userList: usersSliceReducers,
    transactionList: transactionSliceReducers,
    reminderList: reminderSliceReducers,
  },
});

export default appStore;
