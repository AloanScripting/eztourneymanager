// import { useState, useEffect } from "react";
// import { doc, getDoc,getDocs, collection,query } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import { db, getCurrentUser } from "../firestorev9/firestorev9.utils";

// const TournamentStandings = () => {
  
//   const { id } = useParams();
//   const [tournamentData, setTournamentData] = useState({});

//   useEffect(() => {
//     const fetchTournamentsData = async () => {
//       const currentUser = await getCurrentUser();
//       if (!currentUser) return;

//       const tournamentsRef = collection(db, `users/${currentUser.uid}/tournaments`);
//       const querySnapshot = await getDocs(query(tournamentsRef));

//       const tournamentsData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         uid: doc.uid,
//         ...doc.data(),
//       }));

//       setTournamentData(tournamentsData);
//       console.log(tournamentsData);
//     };

//     fetchTournamentsData();
//   }, []);

//   return (
//     <div>
//       <h1>Tournament Holder</h1>
//       <p>Tournament name: {tournamentData.id}</p>
//       <p>Points per place: {tournamentData.pointsPerPlace}</p>
//       <p>Created by: {tournamentData.createdBy}</p>
//     </div>
//   );
// };

// export default TournamentStandings;
