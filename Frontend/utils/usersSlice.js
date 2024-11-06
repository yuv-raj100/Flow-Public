import { createSlice } from "@reduxjs/toolkit";





const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    items: [],
  },
  reducers: {
    addUser: (state, action) => {
      console.log("hi");
      state.items.push(action.payload);
    },

    setUsers: (state, action) => {
      state.items = action.payload; 
    },
  },
});

export const { addUser, setUsers } = usersSlice.actions;
export default usersSlice.reducer;
