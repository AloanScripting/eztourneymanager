import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firestorev9/firestorev9.utils';

const TournamentHolder = () => {
  const location = useLocation();
  const tournamentData = location.state?.tournamentData;
  const [tournament, setTournament] = useState(null);
  console.log(tournamentData);
  // useEffect(() => {
  //   const fetchTournament = async () => {
  //     const tournamentRef = doc(db, 'tournaments', tournamentData.id);
  //     const tournamentSnapshot = await getDoc(tournamentRef);

  //     if (tournamentSnapshot.exists()) {
  //       setTournament(tournamentSnapshot.data());
  //     } else {
  //       console.log(`Tournament with id ${tournamentData.id} does not exist`);
  //     }
  //   };

  //   fetchTournament();
  // }, [tournamentData]);
useEffect(() => {
  const fetchTournament = async () => {
    const tournamentRef = doc(db, 'tournaments', tournamentData.id);
    const tournamentSnapshot = await getDoc(tournamentRef);

    if (tournamentSnapshot.exists()) {
      setTournament(tournamentSnapshot.data());
    } else {
      console.log(`Tournament with id ${tournamentData.id} does not exist`);
    }
  };

  fetchTournament();
}, [tournamentData]);
return (
  <div>
    {tournament ? (
      <>
        <h2>{tournament.name}</h2>
        <p>Tournament Holder: {tournamentData.createdBy}</p>
        <p>Points per place: {tournament.pointsPerPlace.join(', ')}</p>
        {/* Display other tournament data */}
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
); }
;

export default TournamentHolder;
