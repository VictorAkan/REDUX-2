import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header className="flex space-x-[65rem] bg-sky-400 p-5 items-center">
            <h1 className="font-bold text-3xl">Redux Blog</h1>
            <nav>
                <div className="ml-auto">
                    <ul className="flex text-white space-x-8">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="post">Post</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header