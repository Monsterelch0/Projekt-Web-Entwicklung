import { useState } from 'react';
import { LoginCommand } from '../commands/LoginCommand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const login = new LoginCommand(email, password);

    if (!email || !password) {
      setMessage('Bitte alle Felder ausfüllen.');
      return;
    }

    try {
      const result = await login.execute();
      setMessage(`Willkommen zurück, ${result.first_name}!`);
      // Optional: Redirect oder User-Kontext
    } catch (err: any) {
      setMessage('Fehlgeschlagen: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <br />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      <br />
      <button onClick={handleLogin} className="login-button">
        Einloggen
      </button>
      <p className="login-message">{message}</p>
    </div>
  );
}
