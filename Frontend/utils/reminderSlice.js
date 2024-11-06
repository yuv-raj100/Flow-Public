import { createSlice } from "@reduxjs/toolkit";

const reminderSlice = createSlice({
  name: "reminderSlice",
  initialState: {
    items: [],
  },
  reducers: {
    addReminder: (state, action) => {
      state.items.push(action.payload);
    },

    setReminder: (state, action) => {
      // console.log(action.payload)
      state.items = action.payload;
    },

    toggleReminder: (state, action) => {
      const tId = action.payload;
      // console.log(tId);
      const trans = state.items.find((transaction) => transaction._id === tId);
      // console.log(trans)
      if (trans) {
        trans.isActive = !trans.isActive; // Toggle isActive
      }
      // console.log(state.items);
    },

    sortReminders: (state, action) => {
      const order = action.payload;
      state.items.sort((a, b) => {
        if (order === "increasing") {
          return new Date(a.createdOn) - new Date(b.createdOn);
        } else {
          return new Date(b.createdOn) - new Date(a.createdOn);
        }
      });
    },
  },
});

export const { addReminder, setReminder, toggleReminder, sortReminders } = reminderSlice.actions;
export default reminderSlice.reducer;
