import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodeId: 1,
  caller: "",
  qty: 0,
  price: 0,
  message: "",
};

export const billNodeSlice = createSlice({
  name: "billNode",
  initialState,
  reducers: {
    setCaller: (state, action) => {
      state.caller = action.payload;
    },
    clearCaller: (state) => {
      state.caller = "";
    },
    setNodeId: (state, action) => {
      state.nodeId = action.payload;
    },
    clearNodeId: (state) => {
      state.nodeId = 0;
    },
    setQty: (state, action) => {
      state.qty = action.payload;
    },
    clearQty: (state) => {
      state.qty = 0;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    clearPrice: (state) => {
      state.price = 0;
    },
    clearBill: (state) => {
      state.caller = "";
      state.qty = 0;
      state.price = 0;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = "";
    },
  },
});

export const {
  setCaller,
  clearCaller,
  setQty,
  clearQty,
  setPrice,
  clearPrice,
  clearBill,
  setNodeId,
  clearNodeId,
  setMessage,
  clearMessage,
} = billNodeSlice.actions;

export default billNodeSlice.reducer;

// Selector
export const selectBillNode = (state) => state.billNode;
