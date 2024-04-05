// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Reservations from "./Reservations";
// import { API_URL } from "../main";

export default function Account({ token }) {
//   const navigate = useNavigate();
//   const [reservations, setReservations] = useState([]);

//   const getReservations = async() => {
//     try {
//       const response = await fetch(`${API_URL}/reservations`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await response.json();
//       setReservations(result.reservation);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getReservations();
//   }, []);

//   return (
//     <>
//       <div className="reservations">
//         <h1>Account</h1>
//         <div className="reservations-display">
//           {token ? (
//             // if token is valid display reservations
//             reservations.length > 0 ? (
//               reservations.map((reservation) => {
//                 return (
//                   <Reservations
//                     key={reservation.id}
//                     reservation={reservation}
//                     setReservations={setReservations}
//                     token={token}
//                   />
//                 );
//               })
//             ) : (
//                 // if no reservations display text
//               <p>No books currently checked out</p>
//             )
//           ) : (
//               // if token is not valid link to register or login
//             <h3>
//               Please log in
//               <button onClick={() => navigate("/login")}>Login</button>
//               or register
//               <button onClick={() => navigate("/register")}>Register</button>
//               to your account
//             </h3>
//           )}
//         </div>
//       </div>
//     </>
//   );
}
