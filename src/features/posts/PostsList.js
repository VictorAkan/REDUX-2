import { useSelector } from "react-redux";
import { selectPostIds, getPostsError, getPostsStatus } from "./postsSlice";

import PostExcerpt from "./PostExcerpt";
import Loader from "../../components/Loader";

const PostsList = () => {
    const orderedPostIds = useSelector(selectPostIds)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    let content;
    if (postStatus === 'loading') {
        content = <Loader className="mt-20" />
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId} />)
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