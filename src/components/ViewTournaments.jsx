import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, db } from '../firestorev9/firestorev9.utils';
import { collection, query, getDocs, doc, setDoc, updateDoc, getDoc, writeBatch } from 'firebase/firestore';

const ViewTournaments = () => {
  const [tournamentsData, setTournamentsData] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchTournamentsData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const tournamentsRef = collection(db, `users/${currentUser.uid}/tournaments`);
      const querySnapshot = await getDocs(query(tournamentsRef));

      const tournamentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.uid,
        ...doc.data(),
      }));

      setTournamentsData(tournamentsData);
    };

    fetchTournamentsData();
  }, []);

  const resetPoints = async (tournamentId, participants) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const tournamentRef = doc(db, `users/${currentUser.uid}/tournaments/${tournamentId}`);

    const updatedParticipants = {};
    Object.keys(participants).forEach((key) => {
      updatedParticipants[key] = { ...participants[key], points: 0 };
    });

    await setDoc(tournamentRef, { participants: updatedParticipants }, { merge: true });
  };

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleBackClick = () => {
    setSelectedTournament(null);
  };

  const handleOldPoints = async (participantId, event) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const value = parseInt(event.target.value);

    const oldPoints = isNaN(value) ? 0 : value;

    const tournamentRef = doc(
      db,
      `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${participantId}`
    );

    await setDoc(
      tournamentRef,
      {
        ...selectedTournament.participants[participantId],
        oldPoints: oldPoints,
      },
      { merge: true }
    );
    setSelectedTournament({
      ...selectedTournament,
      participants: {
        ...selectedTournament.participants,
        [participantId]: {
          ...selectedTournament.participants[participantId],
          oldPoints: oldPoints,
        },
      },
    });
    console.log(oldPoints);
  };

  const updateParticipantPoints = async (participantId, event) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const tournamentRef = doc(
      db,
      `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${participantId}`
    );

    let points = parseInt(event.target.value);
    if (isNaN(points)) {
      points = 0;
    }

    await updateDoc(tournamentRef, {
  ...selectedTournament.participants[participantId],
  points: points,
});
  };
  const handleAllPointsSubmit = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
  
    const participantsToUpdate = Object.entries(selectedTournament.participants)
  .filter(([_, participant]) => participant.oldPoints !== undefined)
  .map(([id, participant]) => ({ id, points: participant.oldPoints + participant.points }));


  
    const batch = writeBatch();
    participantsToUpdate.forEach(({ id, points }) => {
      const participantRef = doc(
        db,
        `users/${currentUser.uid}/tournaments/${selectedTournament.id}/participants/${id}`
      );
      batch.update(participantRef, { points });
    });
  
    await batch.commit();
  
    const updatedTournamentsRef = collection(db, `users/${currentUser.uid}/tournaments`);
    const updatedTournamentsSnapshot = await getDocs(query(updatedTournamentsRef));
    const updatedTournamentsData = updatedTournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      uid: doc.uid,
      ...doc.data(),
    }));
    setTournamentsData(updatedTournamentsData);
  
    setSelectedTournament(null);
  };


  return (
    <div>
      <h1>Tournaments</h1>
      {!selectedTournament ? (
        <div>
          {tournamentsData ? (
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
            <p>Loading...</p>
          )}      <Link to="/create-tournament">Add new tournament</Link>
          </div>
        ) : (
          <div>
            <h2>{selectedTournament.name}</h2>
            <button onClick={() => resetPoints(selectedTournament.id, selectedTournament.participants)}>
              Reset points
            </button>
            <button onClick={handleBackClick}>Back to tournaments</button>
            <table>
              <thead>
                <tr>
                  <th>Participant name</th>
                  <th>Add/Subtract Points</th>
                  <th>Current Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(selectedTournament.participants).map((participantId) => (
                  <tr key={participantId}>
                    <td>{selectedTournament.participants[participantId].name}</td>
                    <td>
                      <input
                        type="number"
                        value={selectedTournament.participants[participantId].points}
                        onChange={(event) => updateParticipantPoints(participantId, event)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={selectedTournament.participants[participantId].oldPoints || ''}
                        onChange={(event) => handleOldPoints(participantId, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleAllPointsSubmit}>Submit all</button>
          </div>
        )}
      </div>
      );
};

export default ViewTournaments;