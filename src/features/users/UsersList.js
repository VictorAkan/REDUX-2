import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {
    const users = useSelector(selectAllUsers)

    const renderedUsers = users.map(user => (
        <li key={user.id} className="hover:text-slate-200">
            <Link to={`/user/${user.id}`}>{user.name}</Link>
        </li>
    ))

    return (
        <section>
            <h2 className="text-center text-2xl mt-10">Users</h2>
            <ul className="bg-sky-700 w-96 ml-5 p-4 text-slate-300 rounded-md">{renderedUsers}</ul>
        </section>
    )
}

export default UsersList