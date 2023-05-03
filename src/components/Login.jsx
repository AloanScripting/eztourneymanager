import { 
  useState, 
  useEffect 
} from "react";
import { useNavigate } from "react-router-dom";
import {
   signInWithEmailAndPassword, 
   signInWithGoogle, 
   signInWithFacebook 
  } from "../firestorev9/firestorev9.utils";
import { auth } from "../firestorev9/firestorev9.utils";
const Login = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useNavigate();

  // check authentication state on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        history("/dashboard");
      } else {
        setError(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // remove error state
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null); // remove error state
    try {
      await signInWithGoogle();
    } catch (error) {
      setError("Failed to log in with Google");
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null); // remove error state
    try {
      await signInWithFacebook();
    } catch (error) {
      setError("Failed to log in with Facebook");
    }
  };

  const goToSignup = (e) => {
    e.preventDefault();
     history('/signup');
  };

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log in</button>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
        <p>Don't have an account? <span onClick={goToSignup}>Sign up now!</span></p>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;