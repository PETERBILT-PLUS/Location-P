import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
    nom: string,
    prenom: string,
    email: string,
}

interface IInitialState {
    currentUser: IUser | null,
}

const initialState: IInitialState = {
    currentUser: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<IUser | null>) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
    },
});

export const { loginUser, logout } = userSlice.actions;
export default userSlice.reducer;