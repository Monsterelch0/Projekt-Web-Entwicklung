// src/components/Login.tsx
import { useState } from 'react';
import { LoginCommand } from '../commands/LoginCommand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  
  
  const handleLogin = async () => {
    const login = new LoginCommand(email, password);
    // Validate input
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const result = await login.execute();
      setMessage(`Welcome Back, ${result.username}!`);
      // Optional: User-Context setzen
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Einloggen</button>
      <p>{message}</p>
    </div>
  );
}
