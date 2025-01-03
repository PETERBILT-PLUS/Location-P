import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for an agency
interface IAgency {
    nom: string;
    prenom: string;
    email: string;
    address: string;
    agenceLocalisation: string | null;
    businessLicenseNumber: string | null;
    city: string;
    createdAt: Date | string;
    insurancePolicyNumber: string | number;
    phoneNumber: string;
    registrationNumber: string;
    subscriptionExpiresAt: string;
    updatedAt: Date | string;
    website: string | null;
    __v: number;
    _id: string;
}

// Define the initial state
interface IInitialState {
    currentAgency: IAgency | null;
}

const initialState: IInitialState = {
    currentAgency: null,
}

// Define the agency slice
const agencySlice = createSlice({
    name: "agency",
    initialState,
    reducers: {
        // Define the loginAgency reducer
        loginAgency: (state, action: PayloadAction<IAgency | null>) => {
            state.currentAgency = action.payload;
        },
        // Define the logoutAgency reducer
        logoutAgency: (state) => {
            state.currentAgency = null;
        }
    }
});

// Export actions and reducer
export const { loginAgency, logoutAgency } = agencySlice.actions;
export default agencySlice.reducer;
