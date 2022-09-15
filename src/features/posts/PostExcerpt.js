import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactButtons from "./ReactButtons";
import { Link } from "react-router-dom";

const PostExcerpt = ({ post }) => {
    return (
        <article className="rounded-lg drop-shadow-md p-3 bg-white w-96 mt-5">
            <h3 className="font-bold text-xl">{post.title}</h3>
            <p className="">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`} className="mr-3 text-white hover:bg-sky-400 bg-sky-500 rounded-md p-1">View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactButtons post={post} />
        </article>
    )
}

export default PostExcerpt