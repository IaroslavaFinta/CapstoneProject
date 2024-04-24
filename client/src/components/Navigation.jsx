import { Link } from "react-router-dom";

export default function Navigation({ token }) {
  return (
    <div className="flex justify-evenly">
      {token ? (
        <>
          <Link to="/" className="mx-14 mb-14">
            Home
          </Link>
          <Link to="/products" className="mx-14 mb-14">
            Products
          </Link>
          <Link to="/account" className="mx-14 mb-14">
            Account
          </Link>
          <Link to="/myCart" className="mx-14 mb-14">
            My Cart
          </Link>
        </>
      ) : (
        <>
          <Link to="/" className="mx-14 mb-14">
            Home
          </Link>
          <Link to="/products" className="mx-14 mb-14">
            Products
          </Link>
          <Link to="/login" className="mx-14 mb-14">
            Login
          </Link>
          <Link to="/register" className="mx-14 mb-14">
            Register
          </Link>
        </>
      )}
    </div>
  );
}
