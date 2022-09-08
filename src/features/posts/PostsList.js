import { useSelector,useDispatch } from "react-redux";
import { selectAllPosts,getPostsError,getPostsStatus,fetchPosts } from "./postsSlice";
import { useEffect } from "react";

import PostExcerpt from "./PostExcerpt";

const PostsList = () => {
    const dispatch = useDispatch()

    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content
    if (postStatus === 'loading') {
        content = <p>'Loading...'</p>
    } else if (postStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostExcerpt key={post.id} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section className="flex justify-center mt-20">
            <div>
                <h2 className="font-bold text-3xl">Posts</h2>
                {content}
            </div>
        </section>
    )
}

export default PostsList