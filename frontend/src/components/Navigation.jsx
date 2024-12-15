import { Link } from "react-router-dom";

const Navigation = () => {
	return (
		<nav className="w-full px-4 h-14 place-content-around">
			<ul className="flex flex-row flex-wrap list-none justify-center gap-8 mt-auto mb-auto">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/blog">Blog</Link>
				</li>
				<li>
					<a href="/gallery">Gallery (Non-SPA)</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
