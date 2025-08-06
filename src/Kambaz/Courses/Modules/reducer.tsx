import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  modules: [],
};
const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    addModule: (state, { payload: module }) => {
      // Use the module data returned from the server, which includes the server-generated _id
      state.modules = [...state.modules, module] as any;
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter((m: any) => m._id !== moduleId);
    },
    updateModule: (state, { payload: module }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === module._id ? module : m
      ) as any;
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === moduleId ? { ...m, editing: true } : m
      ) as any;
    },
    setModules: (state, { payload: modules }) => {
      state.modules = modules;
    },
  },
});
export const { addModule, deleteModule, updateModule, editModule, setModules } =
  modulesSlice.actions;
export default modulesSlice.reducer;