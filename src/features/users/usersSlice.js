import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = [
    
]

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const res = await fetch(USERS_URL)
        const data = await res.json()
        return data
    } catch (err) {
        return err.message
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, userId) => 
    state.users.find(user => user.id === userId)

export default usersSlice.reducer;