import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedItems: {}, // Format: { stepId: [ { ...productObject, quantity: 1 }, ... ] }
};

const builderSlice = createSlice({
    name: 'builder',
    initialState,
    reducers: {
        selectItem: (state, action) => {
            const { stepId, product } = action.payload;
            if (!state.selectedItems[stepId]) {
                state.selectedItems[stepId] = [];
            }
            // Optional: Check if product already exists in this category to increase quantity instead?
            // For now, just add as a new entry to allow different configurations if needed.
            state.selectedItems[stepId].push({ ...product, quantity: 1 });
        },
        updateQuantity: (state, action) => {
            const { stepId, index, quantity } = action.payload;
            if (state.selectedItems[stepId] && state.selectedItems[stepId][index]) {
                state.selectedItems[stepId][index].quantity = Math.max(1, quantity);
            }
        },
        removeItem: (state, action) => {
            const { stepId, index } = action.payload;
            if (state.selectedItems[stepId]) {
                state.selectedItems[stepId].splice(index, 1);
                if (state.selectedItems[stepId].length === 0) {
                    delete state.selectedItems[stepId];
                }
            }
        },
        clearBuilder: (state) => {
            state.selectedItems = {};
        }
    }
});

export const { selectItem, removeItem, clearBuilder, updateQuantity } = builderSlice.actions;
export default builderSlice.reducer;
