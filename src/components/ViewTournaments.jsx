import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, db } from '../firestorev9/firestorev9.utils';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';

const ViewTournaments = () => {
  const [tournamentsData, setTournamentsData] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchTournamentsData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const tournamentsRef = collection(db, `users/${currentUser.uid}/tournaments`);
      const querySnapshot = await getDocs(query(tournamentsRef));

      const tournamentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.uid,
        ...doc.data(),
      }));

      setTournamentsData(tournamentsData);
    };

    fetchTournamentsData();
  }, []);

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleBackClick = () => {
    setSelectedTournament(null);
  };

  const handlePointsPerPlaceChange = async (participantId, event) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const tournamentRef = doc(db, `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${participantId}`);

    await setDoc(tournamentRef, {
      ...selectedTournament.participants[participantId],
      pointsPerPlace: event.target.value,
    }, { merge: true });

    setSelectedTournament({
      ...selectedTournament,
      participants: {
        ...selectedTournament.participants,
        [participantId]: {
          ...selectedTournament.participants[participantId],
          pointsPerPlace: event.target.value,
        },
      },
    });
  };

  const handleParticipantNameChange = async (participantId, event) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const tournamentRef = doc(db, `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${participantId}`);

    await setDoc(tournamentRef, {
      ...selectedTournament.participants[participantId],
      name: event.target.value,
    }, { merge: true });

    setSelectedTournament({
      ...selectedTournament,
      participants: {
        ...selectedTournament.participants,
        [participantId]: {
          ...selectedTournament.participants[participantId],
          name: event.target.value,
        },
      },
    });
  };

  const handleSubmitPoints = async (participantId, event) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
  
    const newPoints = parseInt(event.target.value);
    const tournamentRef = doc(
      db,
      `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${participantId}`
    );
  
    await setDoc(tournamentRef, {
      ...selectedTournament.participants[participantId],
      points: newPoints,
    });
  
    setSelectedTournament({
      ...selectedTournament,
      participants: {
        ...selectedTournament.participants,
        [participantId]: {
          ...selectedTournament.participants[participantId],
          points: newPoints,
        },
      },
    });
  };
  
  if (selectedTournament) {
    return (
      <div>
        <h1>Tournament Holder</h1>
        <p>Tournament name: {selectedTournament.name}</p>
        <p>Created by: {selectedTournament.createdBy}</p>
        <button onClick={handleBackClick}>Back to tournaments</button>
        <table>
          <thead>
            <tr>
              <th>Participant Name</th>
              <th>Total Points</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(selectedTournament.participants).map(([id, participant]) => (
              <tr key={id}>
                <td>
                  <input type="text" value={participant.name} onChange={(event) => handleParticipantNameChange(id, event)} />
                </td>
                <td>
                <input type="number" min="0" max="100"  defaultValue={participant.pointsPerPlace} onChange={(event) => handlePointsPerPlaceChange(id, event)} />
                </td>
                <td>
                  <button onClick={(event) => handleSubmitPoints(id, event)}>Submit Points</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h1>Tournament Holder</h1>
      {tournamentsData && tournamentsData.length > 0 ? (
        <ul>
          {tournamentsData.map((tournament) => (
            <li key={tournament.id}>
              <Link to="#" onClick={() => handleTournamentClick(tournament)}>
                {tournament.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tournaments found.</p>
      )}
    </div>
  );
};

export default ViewTournaments;