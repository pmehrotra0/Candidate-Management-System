import { createSlice } from '@reduxjs/toolkit';

const shortListedCandidatesInitialState = {
    shortListedCandidates: [],
}

export const shortListedCandidatesSlice = createSlice({
    name: 'shortListedCandidates',
    initialState: shortListedCandidatesInitialState,
    reducers: {
        addshortListedCandidates: (state, {payload}) => {
            state.shortListedCandidates = payload
        },
    }
})

export const {
    addshortListedCandidates,
} = shortListedCandidatesSlice.actions;

export default shortListedCandidatesSlice.reducer;