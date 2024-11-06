import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    items: [
      //   {
      //     id: 1,
      //     createdOn: new Date().toISOString(),
      //     amount: "5000",
      //     desc: "aaj ka hisab",
      //     reminderDate: "date",
      //     user: "Raj",
      //     isReceived:false,
      //   },
    ],
  },
  reducers: {
    addTransaction: (state, action) => {
      // console.log(action.payload);
      state.items.push(action.payload);
    },

    setTransaction: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addTransaction, setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
