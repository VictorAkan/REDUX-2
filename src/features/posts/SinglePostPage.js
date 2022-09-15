import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactButtons from "./ReactButtons";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";

const SinglePostPage = () => {
    const { postId } = useParams()

    const post = useSelector((state) => selectPostById(state, Number(postId)))

    if (!post) {
        return (
            <section>
                <h2>Post not found</h2>
            </section>
        )
    }

    return (
        <div className="flex justify-center">
            <article className="rounded-lg drop-shadow-md p-3 bg-white w-96 mt-10">
                <h3 className="font-bold text-xl">{post.title}</h3>
                <p>{post.body.substring(0, 100)}</p>
                <p className="postCredit">
                    <Link to={`post/edit/${post.id}`} className="mr-3 text-white hover:bg-green-400 bg-green-500 rounded-md p-1">Edit Post</Link>
                    <PostAuthor userId={post.userId} />
                    <TimeAgo timestamp={post.date} />
                </p>
                <ReactButtons post={post} />
            </article>
        </div>
    )
}

export default SinglePostPage