// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/HomePage';
import './App.css';
export default function App() {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
