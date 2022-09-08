import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactButtons from "./ReactButtons";

const PostExcerpt = ({ post }) => {
    return (
        <article className="rounded-lg drop-shadow-md p-3 bg-white w-96 mt-5">
            <h3 className="font-bold text-xl">{post.title}</h3>
            <p>{post.body.substring(0, 100)}</p>
            <p className="postCredit">
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactButtons post={post} />
        </article>
    )
}

export default PostExcerpt