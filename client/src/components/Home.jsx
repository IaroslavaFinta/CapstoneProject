import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home">
            <h1>Welcome to Reptile World</h1>
            <p>At Reptile World, we are passionate about providing our reptiles with everything they need to care for and enjoy their scaly companions.
                Step into our store and you'll find a wide selection of supplies necessary to create the perfect habitat for your pet. 
                Our knowledgeable staff are here to assist you in finding the equipment for your pet and to answer any questions you may have about reptile care.
                Come visit us today and experience the wonder of the reptile kingdom!</p>
            <h3>
            Browse products available
                <Link to="/products"> here</Link>
            </h3>
        </div>
    );
}