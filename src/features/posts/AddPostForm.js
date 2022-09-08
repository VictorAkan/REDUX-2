import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
// import { nanoid } from "@reduxjs/toolkit";

import { postAdded } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')

    const users = useSelector(selectAllUsers)
    const dispatch = useDispatch()

    const onTitleChanged = (e) => setTitle(e.target.value)
    const onContentChanged = (e) => setContent(e.target.value)
    const onAuthorChanged = (e) => setUserId(e.target.value)

    const onSavedPostClicked = () => {
        if (title && content) {
            dispatch(
                postAdded(title, content, userId)
            )
            setTitle('')
            setContent('')
        }
    }

    const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <section className="flex justify-center">
            <div>
                <h2 className="capitalize font-bold text-4xl mt-3">Add a new post</h2>
                <form onSubmit={handleSubmit} className="bg-gray-700 w-[30rem] mt-4 p-3 drop-shadow-md rounded-md">
                    <div className="mt-3">
                        <label className="text-white text-left text-xl" htmlFor="postTitle">Post Title:</label>
                        <div>
                            <input
                                className="bg-gray-900 text-white focus:outline-none focus:ring focus:ring-gray-200 p-2"
                                type="text"
                                name="postTitle"
                                value={title}
                                onChange={onTitleChanged}
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-white text-xl" htmlFor="postAuthor">Author:</label>
                        <div>
                            <select className="bg-gray-900 text-white focus:outline-none focus:ring focus:ring-gray-200 p-2" id="postAuthor" value={userId} onChange={onAuthorChanged}>
                                <option value=""></option>
                                {usersOptions}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-white text-xl" htmlFor="postContent">Content:</label>
                        <div>
                            <textarea
                                className="bg-gray-900 w-96 text-white focus:outline-none focus:ring focus:ring-gray-200 p-3"
                                name="postContent"
                                value={content}
                                onChange={onContentChanged}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            className="mt-3 bg-gray-500 text-white p-2 hover:bg-gray-400 rounded-md"
                            onClick={onSavedPostClicked}
                            disabled={!canSave}
                        >
                            Save Post
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddPostForm