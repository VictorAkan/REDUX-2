import { useSelector } from "react-redux";
import { selectPostIds } from "./postsSlice";
import { useGetPostsQuery } from "./postsSlice";

import PostExcerpt from "./PostExcerpt";
import Loader from "../../components/Loader";

const PostsList = () => {
    const {
        isSuccess,
        isLoading,
        isError,
        error
    } = useGetPostsQuery()

    const orderedPostIds = useSelector(selectPostIds)

    let content;
    if (isLoading) {
        content = <Loader className="mt-20" />
    } else if (isSuccess) {
        content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId} />)
    } else if (isError) {
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