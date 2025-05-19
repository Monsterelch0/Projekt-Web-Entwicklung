import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { LoginCommand } from '../commands/LoginCommand'; // We'll bypass this for now

// Interface for the expected response from LoginCommand (can be removed or kept for future use)
// interface LoginResponse {
//   first_name: string;
//   token?: string;
// }

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault(); // Prevents page reload on form submit
    }

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true); // Activate loading state
    setMessage(''); // Reset old messages

    // --- Proof of Concept: Bypass backend call and redirect immediately ---
    // Simulate a short delay to make the loading state visible
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay

    // Since there's no backend, we directly navigate
    // You can optionally log a message or set a mock user state here if needed
    console.log('Proof of Concept: Login successful (no backend call)');

    navigate('/home');
    // No need to setIsLoading(false) here if we are navigating away immediately,
    // but if there was any chance of staying on the page, you would.
    // For a clean component unmount, it's generally good practice,
    // though in this redirect case, it's less critical.
    // We can add it just in case.
    setIsLoading(false);
    // --- End of Proof of Concept modification ---

    /*
    // ORIGINAL BACKEND LOGIC - Keep for future reference or comment out
    const loginCommand = new LoginCommand(email, password);

    try {
      // const result: LoginResponse = await loginCommand.execute(); // Backend call
      // console.log(`Welcome back, ${result.first_name}!`);

      // Store Token here when implemented
      // if (result.token) {
      //   localStorage.setItem('authToken', result.token);
      // }

      // Redirect to the main page after successful login
      navigate('/home');

    } catch (err: any) {
      setMessage('Error: ' + (err.message || 'Unknown error during login.'));
    } finally {
      setIsLoading(false); // Deactivate loading state
    }
    */
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          disabled={isLoading} // Disable input while loading
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          disabled={isLoading} // Disable input while loading
        />
        <br />
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}