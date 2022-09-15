import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectAllPosts } from "../posts/postsSlice";
import { Link,useParams } from "react-router-dom";

const UsersPage = () => {
    const { userId } = useParams()
    const user = useSelector((state) => selectUserById(state, Number(userId)))

    const postsForUser = useSelector(state => {
        const allPosts = selectAllPosts(state)
        return allPosts.filter(post => post.userId === Number(userId))
    })

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`post/${post.id}`}>{post.title}</Link>
        </li>
    ))
    return (
        <section className="pl-20 pr-20">
            <h2 className="text-center text-4xl mt-20">{user?.name}</h2>
            <ol className="text-white bg-sky-900 rounded-md p-4 drop-shadow-md mt-10">{postTitles}</ol>
        </section>
    )
}

export default UsersPage