// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}
