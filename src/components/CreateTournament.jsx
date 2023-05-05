import React, { useState } from "react";
import { collection, query, where, doc, setDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firestorev9/firestorev9.utils";

const CreateTournament = () => {
  const { currentUser } = useAuth();
  const [tournamentName, setTournamentName] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const [participantNames, setParticipantNames] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.log("You need to be authenticated to create a tournament.");
      return;
    }

    const userTournamentsRef = collection(db, `users/${currentUser.uid}/tournaments`);
    const queryRef = query(
      userTournamentsRef,
      where("name", "==", tournamentName)
    );
    const querySnapshot = await getDocs(queryRef);

    if (querySnapshot.empty) {
      const newTournamentRef = doc(userTournamentsRef, tournamentName);
      const tournamentData = {
        name: tournamentName,
        participants: participantNames.map((name) => ({
          name,
          id: doc(collection(db, "participants")).id, // generate a new ID for each participant
          })),
        createdBy: currentUser.displayName,
        userUID: currentUser.uid,
      };

      try {
        await setDoc(newTournamentRef, tournamentData);
        console.log(`Tournament "${tournamentName}" created successfully!`);
        setTournamentName("");
        setNumParticipants("");
        setParticipantNames([]);
      } catch (error) {
        console.log("error creating tournament", error.message);
      }
    } else {
      console.log(
        `You already have a tournament named "${tournamentName}" created.`
      );
    }
  };

  const handleNumParticipantsSubmit = (e) => {
    e.preventDefault();
    const parsedNumParticipants = parseInt(numParticipants);
    if (parsedNumParticipants >= 1 && parsedNumParticipants <= 50) {
      const newParticipantNames = Array(parsedNumParticipants).fill("");
      setParticipantNames(newParticipantNames);
    } else {
      alert("Invalid input. Please enter a number between 1 and 50.");
    }
  };

  const handleParticipantNameChange = (e, index) => {
    const newParticipantNames = [...participantNames];
    newParticipantNames[index] = e.target.value;
    setParticipantNames(newParticipantNames);
  };



  const ordinalSuffix = (num) => {
    if (num === 1) {
      return "1st";
    } else if (num === 2) {
      return "2nd";
    } else if (num === 3) {
      return "3rd";
    } else {
      return num + "th";
    }
  };

  return (
    <div>
      <h1>Create Tournament</h1>
      {currentUser ? null : (
        <p>You need to be authenticated to create a tournament.</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Tournament Name:
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Number of Participants (Max: 50):
          <input
            type="text"
            value={numParticipants}
            onChange={(e) => setNumParticipants(e.target.value)}
          />
          <button onClick={handleNumParticipantsSubmit}>Submit</button>
        </label>
        <br />
        {participantNames.map((name, index) => (
          <div key={index}>
            <label>
              {ordinalSuffix(index + 1)} Participant Name:
              <input
                type="text"
                value={name}
                onChange={(e) => handleParticipantNameChange(e, index)}
              />
            </label>
            <br />
          </div>
        ))}
        <br />
        <button type="submit">Create Tournament</button>
      </form>
    </div>
  );
}
export default CreateTournament;