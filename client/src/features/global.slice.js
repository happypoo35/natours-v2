import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceMsg: { type: "", msg: "" },
  showMenu: false,
  showSideMenu: false,
  modal: {
    title: "",
    text: "",
    isConfirmed: false,
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMessage: (state, { payload }) => {
      state.serviceMsg.type = payload.type;
      state.serviceMsg.msg = payload.msg;
    },
    resetMessage: (state) => {
      state.serviceMsg.type = "";
      state.serviceMsg.msg = "";
    },
    setModal: (state, { payload }) => {
      state.modal.title = payload.title;
      state.modal.text = payload.text;
    },
    confirmModal: (state) => {
      state.modal.isConfirmed = true;
    },
    resetModal: (state) => {
      state.modal.title = "";
      state.modal.text = "";
      state.modal.isConfirmed = false;
    },
    setShowMenu: (state, { payload }) => {
      state.showMenu = payload;
    },
    setShowSideMenu: (state, { payload }) => {
      state.showSideMenu = payload;
    },
  },
});

export const selectMsg = (state) => state.global.serviceMsg;
export const selectModal = (state) => state.global.modal;
export const selectIsConfirmed = (state) => state.global.modal.isConfirmed;
export const selectShowMenu = (state) => state.global.showMenu;
export const selectShowSideMenu = (state) => state.global.showSideMenu;

export const {
  setMessage,
  resetMessage,
  setModal,
  confirmModal,
  resetModal,
  setShowMenu,
  setShowSideMenu,
} = globalSlice.actions;

export default globalSlice.reducer;
