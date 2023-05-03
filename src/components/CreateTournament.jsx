import React, { useState } from "react";
import { collection, query, where, doc, setDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firestorev9/firestorev9.utils";

const CreateTournament = () => {
  const { currentUser } = useAuth();
  const [tournamentName, setTournamentName] = useState("");
  const [pointsPerPlace, setPointsPerPlace] = useState([0, 0, 0, 0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.log("You need to be authenticated to create a tournament.");
      return;
    }

    const tournamentsRef = collection(db, "tournaments");
    const queryRef = query(
      tournamentsRef,
      where("name", "==", tournamentName),
      where("createdBy", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(queryRef);

    if (querySnapshot.empty) {
      const newTournamentRef = doc(tournamentsRef);
      const tournamentData = {
        name: tournamentName,
        pointsPerPlace,
        participants: [],
        createdBy: currentUser.uid,
      };

      try {
        await setDoc(newTournamentRef, tournamentData);
        console.log(`Tournament "${tournamentName}" created successfully!`);
        setTournamentName("");
        setPointsPerPlace([0, 0, 0, 0]);
      } catch (error) {
        console.log("error creating tournament", error.message);
      }
    } else {
      console.log(
        `You already have a tournament named "${tournamentName}" created.`
      );
    }
  };

  const handlePointsPerPlaceChange = (e, index) => {
    const newPointsPerPlace = [...pointsPerPlace];
    newPointsPerPlace[index] = parseInt(e.target.value);
    setPointsPerPlace(newPointsPerPlace);
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
          Points per place:
          <br />
          <input
            type="number"
            value={pointsPerPlace[0]}
            onChange={(e) => handlePointsPerPlaceChange(e, 0)}
          />
          {" for 1st place"}
          <br />
          <input
            type="number"
            value={pointsPerPlace[1]}
            onChange={(e) => handlePointsPerPlaceChange(e, 1)}
          />
          {" for 2nd place"}
          <br />
          <input
            type="number"
            value={pointsPerPlace[2]}
            onChange={(e) => handlePointsPerPlaceChange(e, 2)}
          />
          {" for 3rd place"}
          <br />
          <input
            type="number"
            value={pointsPerPlace[3]}
            onChange={(e) => handlePointsPerPlaceChange(e, 3)}
          />
          {" for 4th place"}
          <br />
        </label>
        <br />
        <button type="submit">Create Tournament</button>
      </form>
    </div>
  );
};

export default CreateTournament;
