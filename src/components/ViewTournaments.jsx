import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, db } from '../firestorev9/firestorev9.utils';
import { collection, query, where, getDocs } from 'firebase/firestore';


const ViewTournaments = () => {
  const [tournamentsData, setTournamentsData] = useState(null);

  useEffect(() => {
    const fetchTournamentsData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const tournamentsRef = collection(db, 'tournaments');
      const querySnapshot = await getDocs(query(tournamentsRef, where('createdBy', '==', currentUser.uid)));

      const tournamentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTournamentsData(tournamentsData);
    };

    fetchTournamentsData();
  }, []);

  return (
    <div>
      <h2>My Tournaments</h2>
      {tournamentsData &&
        tournamentsData.map(tournamentData => (
          <div key={tournamentData.id}>
            <Link to={{
              pathname: `/view-tournaments/${tournamentData.id}`,
              state: { tournamentData }
            }}>
              {tournamentData.name}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ViewTournaments;
