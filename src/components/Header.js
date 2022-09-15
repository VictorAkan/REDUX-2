import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { increaseCount,getCounter } from "../features/posts/postsSlice";

const Header = () => {
    const dispatch = useDispatch()
    const count = useSelector(getCounter)
    return (
        <header className="flex space-x-[60rem] bg-sky-400 p-5 items-center">
            <h1 className="font-bold text-3xl">Redux Blog</h1>
            <nav>
                <div className="">
                    <ul className="flex text-white space-x-8">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="post">Post</Link></li>
                        <li><Link to="user">Users</Link></li>
                    </ul>
                    <button onClick={() => dispatch(increaseCount())}>
                        {count}
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Header