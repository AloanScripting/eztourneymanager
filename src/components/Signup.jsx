import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
} from "../firestorev9/firestorev9.utils";

const Signup = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { user } = await createUserWithEmailAndPassword(email, password);
      setCurrentUser(user);
      history("/");
    } catch (error) {
      setError("Failed to create an account");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle();
      await setCurrentUser(user);
      history("/");
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { user } = await signInWithFacebook();
      setCurrentUser(user);
      history("/");
    } catch (error) {
      setError("Failed to sign in with Facebook");
    }
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSignup}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign up</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign up with Google</button>
      <button onClick={handleFacebookSignIn}>Sign up with Facebook</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;
