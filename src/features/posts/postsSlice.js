import { createSlice,nanoid,createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// const initialState = [
//     {
//         id: 1,
//         title: 'Learning Redux Toolkit',
//         content: "I've heard good things.",
//         date: sub(new Date(), { minutes: 10 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//         },
//     },
//     {
//         id: 2,
//         title: 'Slices...',
//         content: "The more i say slice, the more i want pizza",
//         date: sub(new Date(), { minutes: 5 }).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0,
//         },
//     },
// ]

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await fetch(POSTS_URL)
        const data = await response.json() 
        console.log(data)
        return data
    } catch(err) {
        return err.message
    }
})

export const addNewPosts = createAsyncThunk('posts/addNewPosts', async (initialPosts) => {
    try {
        const response = await axios.post(POSTS_URL, initialPosts)
        return response.data
    } catch(err) {
        return err.message
    }
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPosts) => {
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPosts)
        return response.data
    } catch(err) {
        return err.message
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0,
                        },
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        extraReducers(builder) {
            builder
                .addCase(fetchPosts.pending, (state, action) => {
                    state.status = 'loading'
                })
                .addCase(fetchPosts.fulfilled, (state, action) => {
                    state.status = 'succeeded'
                    // Adding date and reactions
                    let min = 1
                    const loadedPosts = action.payload.map(post => {
                        post.date = sub(new Date(), { minutes: min++}).toISOString()
                        post.reactions = {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0,
                        }
                        return post
                    })
                    state.posts = state.posts.concat(loadedPosts)
                })
                .addCase(fetchPosts.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
                })
        }
    },
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostById = (state, postId) => 
    state.posts.posts.find(post => post.id === postId)

export const { postAdded,reactionAdded } = postsSlice.actions

export default postsSlice.reducer