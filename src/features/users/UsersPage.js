import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { Link,useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import Loader from "../../components/Loader"

const UsersPage = () => {
    const { userId } = useParams()
    const user = useSelector((state) => selectUserById(state, Number(userId)))

    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId)

    let content;
    if (isLoading) {
        content = <Loader className="mt-20" />
    } else if (isSuccess) {
        const { ids,entities } = postsForUser
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error}</p>
    }

    return (
        <section className="pl-20 pr-20">
            <h2 className="text-center text-4xl mt-20">{user?.name}</h2>
            <ol className="text-white bg-sky-900 rounded-md p-4 drop-shadow-md mt-10">{content}</ol>
        </section>
    )
}

export default UsersPage