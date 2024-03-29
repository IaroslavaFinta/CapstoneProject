import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home">
            <h1>Welcome to Book Buddy</h1>
            <h3>
            Browse products available
                <Link to="/products"> here</Link>
            </h3>
        </div>
    );
}