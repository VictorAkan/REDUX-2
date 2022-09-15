import { useSelector } from "react-redux";
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts } from "./postsSlice";

import PostExcerpt from "./PostExcerpt";
import Loader from "../../components/Loader";

const PostsList = () => {
    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    let content;
    if (postStatus === 'loading') {
        content = <Loader className="mt-20" />
    } else if (postStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostExcerpt post={post} key={post.id} />)
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