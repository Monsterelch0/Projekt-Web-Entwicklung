import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCommand } from '../commands/LoginCommand'; 
import { setAccount } from '../lib/account';

// Interface for the expected response from LoginCommand
interface LoginResponse {
  message?: string;
  userId: number;
}

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

    const loginCommand = new LoginCommand(email, password);

    try {
      const result: LoginResponse = await loginCommand.execute();
      console.log(result.message);
      //console.log(`Welcome back, ${result.first_name}!`);

      setAccount(result.userId);

      // Redirect to the main page after successful login
      navigate('/home');

    } catch (err: any) {
      setMessage('Error: ' + (err.message || 'Unknown error during login.'));
    } finally {
      setIsLoading(false); // Deactivate loading state
    }
  };

  return (
    <div className="login-container">
      {}
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
      <div className='PlatformSignIn'>
        <div>
          <button className="login-button" onClick={() => alert('Google Sign-In not implemented yet!')}>
            <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw" width="20" height="20"/>
          </button>
        </div>
        <div>
          <button className="login-button" onClick={() => alert('Facebook Sign-In not implemented yet!')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/960px-Facebook_Logo_%282019%29.png" width="20" height="20" />
          </button>
        </div>
        
      </div>
    </div>
  );
}