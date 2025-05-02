// src/Login.tsx
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    alert(`Angemeldet als ${username}`);
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Benutzername"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Einloggen</button>
    </div>
  );
}
