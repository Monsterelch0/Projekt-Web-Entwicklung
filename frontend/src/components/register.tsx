// src/components/Register.tsx
import { useState } from 'react';
import { RegisterCommand } from '../commands/RegisterCommand';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!firstName || !email || !password || !repeatPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password !== repeatPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const register = new RegisterCommand(firstName, email, password);
    try {
      const result = await register.execute();
      setMessage(`Registration successful, welcome ${result.first_name}!`);
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Repeat Password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Register</button>
      <br />
      <p>{message}</p>
            {/* hier fehlt routing */}
      <button>Want to Login insted</button>
    </div>
  );
}
