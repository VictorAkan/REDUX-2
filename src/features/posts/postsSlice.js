import { 
    createSlice, 
    createAsyncThunk, 
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

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

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
    count: 0,
})

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
    const { id } = initialPosts
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPosts)
        return response.data
    } catch(err) {
        // return err.message
        return initialPosts // only for testing redux
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPosts) => {
    const { id } = initialPosts
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPosts
        return `${response?.status}: ${response?.statusText}`
    } catch(err) {
        return err.message
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
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
                    postsAdapter.upsertMany(state, loadedPosts)
                })
                .addCase(fetchPosts.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
                })
                .addCase(addNewPosts.fulfilled, (state, action) => {
                    action.payload.userId = Number(action.payload.userId)
                    action.payload.date = new Date().toISOString()
                    action.payload.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    console.log(action.payload)
                    postsAdapter.addOne(state, action.payload)
                })
                .addCase(updatePost.fulfilled, (state, action) => {
                    if (!action.payload?.id) {
                        console.log('Update could not complete')
                        console.log(action.payload)
                        return;
                    }
                    const { id } = action.payload
                    action.payload.date = new Date().toISOString()
                    postsAdapter.upsertOne(state, action.payload)
                })
                .addCase(deletePost.fulfilled, (state, action) => {
                    if (!action.payload?.id) {
                        console.log('Delete could not complete')
                        console.log(action.payload)
                        return;
                    }
                    const { id } = action.payload
                    postsAdapter.removeOne(state, id)
                })
        }
})

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCounter = (state) => state.posts.count

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)

export const { increaseCount,reactionAdded } = postsSlice.actions

export default postsSlice.reducer