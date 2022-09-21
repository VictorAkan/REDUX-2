import { 
    // createSlice, 
    // createAsyncThunk, 
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";
// import axios from "axios";

// const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState()

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
//     try {
//         const response = await fetch(POSTS_URL)
//         const data = await response.json() 
//         console.log(data)
//         return data
//     } catch(err) {
//         return err.message
//     }
// })

// export const addNewPosts = createAsyncThunk('posts/addNewPosts', async (initialPosts) => {
//     try {
//         const response = await axios.post(POSTS_URL, initialPosts)
//         return response.data
//     } catch(err) {
//         return err.message
//     }
// })

// export const updatePost = createAsyncThunk('posts/updatePost', async (initialPosts) => {
//     const { id } = initialPosts
//     try {
//         const response = await axios.put(`${POSTS_URL}/${id}`, initialPosts)
//         return response.data
//     } catch(err) {
//         // return err.message
//         return initialPosts // only for testing redux
//     }
// })

// export const deletePost = createAsyncThunk('posts/deletePost', async (initialPosts) => {
//     const { id } = initialPosts
//     try {
//         const response = await axios.delete(`${POSTS_URL}/${id}`)
//         if (response?.status === 200) return initialPosts
//         return `${response?.status}: ${response?.statusText}`
//     } catch(err) {
//         return err.message
//     }
// })

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes:min++ }).toISOString()
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post
                })
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (results, error, arg) => [
                { type:'Post', id:"LIST" },
                ...results.ids.map(id => ({ type:'Post', id }))
            ]
        }),
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes:min++ }).toISOString()
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post
                })
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (results, error, arg) => {
                return [
                ...results.ids.map(id => ({ type:'Post', id }))
            ]
            }
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags:(result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags:(result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        addReaction: builder.mutation({
            query: ({ postId,reactions }) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                body:  { reactions }
            }),
            async onQueryStarted({ postId,reactions }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        const post = draft.entities[postId]
                        if (post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation,
} = extendedApiSlice

// const postsSlice = createSlice({
//     name: 'posts',
//     initialState,
//     reducers: {
//         reactionAdded(state, action) {
//             const { postId, reaction } = action.payload
//             const existingPost = state.entities[postId]
//             if (existingPost) {
//                 existingPost.reactions[reaction]++
//             }
//         },
//     },
//     extraReducers(builder) {
//             builder
//                 .addCase(fetchPosts.pending, (state, action) => {
//                     state.status = 'loading'
//                 })
//                 .addCase(fetchPosts.fulfilled, (state, action) => {
//                     state.status = 'succeeded'
//                     // Adding date and reactions
//                     let min = 1
//                     const loadedPosts = action.payload.map(post => {
//                         post.date = sub(new Date(), { minutes: min++}).toISOString()
//                         post.reactions = {
//                             thumbsUp: 0,
//                             wow: 0,
//                             heart: 0,
//                             rocket: 0,
//                             coffee: 0,
//                         }
//                         return post
//                     })
//                     postsAdapter.upsertMany(state, loadedPosts)
//                 })
//                 .addCase(fetchPosts.rejected, (state, action) => {
//                     state.status = 'failed'
//                     state.error = action.error.message
//                 })
//                 .addCase(addNewPosts.fulfilled, (state, action) => {
//                     action.payload.userId = Number(action.payload.userId)
//                     action.payload.date = new Date().toISOString()
//                     action.payload.reactions = {
//                         thumbsUp: 0,
//                         wow: 0,
//                         heart: 0,
//                         rocket: 0,
//                         coffee: 0,
//                     }
//                     console.log(action.payload)
//                     postsAdapter.addOne(state, action.payload)
//                 })
//                 .addCase(updatePost.fulfilled, (state, action) => {
//                     if (!action.payload?.id) {
//                         console.log('Update could not complete')
//                         console.log(action.payload)
//                         return;
//                     }
//                     // const { id } = action.payload
//                     action.payload.date = new Date().toISOString()
//                     postsAdapter.upsertOne(state, action.payload)
//                 })
//                 .addCase(deletePost.fulfilled, (state, action) => {
//                     if (!action.payload?.id) {
//                         console.log('Delete could not complete')
//                         console.log(action.payload)
//                         return;
//                     }
//                     const { id } = action.payload
//                     postsAdapter.removeOne(state, id)
//                 })
//         }
// })

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)

// export const getPostsStatus = (state) => state.posts.status
// export const getPostsError = (state) => state.posts.error
// export const getCounter = (state) => state.posts.count

// export const selectPostsByUser = createSelector(
//     [selectAllPosts, (state, userId) => userId],
//     (posts, userId) => posts.filter(post => post.userId === userId)
// )

// export const { reactionAdded } = postsSlice.actions

// export default postsSlice.reducer