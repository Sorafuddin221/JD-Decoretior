import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

// Fetch chat history between a user and admin
export const fetchChatHistory = createAsyncThunk('chat/fetchHistory', async (userId, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/api/chat/history/${userId}`);
        return data.messages;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Could not fetch chat history');
    }
});

// Send a chat message
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ receiverId, message, isAdmin }, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/api/chat/send', { receiverId, message, isAdmin });
        return data.message; // The newly saved message object
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Could not send message');
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        receiveMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearChatErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    }
});

export const { receiveMessage, clearChatErrors } = chatSlice.actions;
export default chatSlice.reducer;
