import { createSlice } from '@reduxjs/toolkit';

export const submissionsSlice = createSlice({
    name: 'submissions',
    initialState: {
        totalAcceptedSubmissions: 0,
    },
    reducers: {
        setTotalAcceptedSubmissions: (state, action) => {
            state.totalAcceptedSubmissions = action.payload;
        },
    },
});

export const { setTotalAcceptedSubmissions } = submissionsSlice.actions;

export default submissionsSlice.reducer;
