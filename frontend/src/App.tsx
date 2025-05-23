// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import LoginConcept from './components/loginconcept';
import HomePage from './components/HomePage';

// Importiere Spieleseiten
import SlotMachinePage from './games/slots/SlotMachinePage';
import HighLowPage from './games/high-low/HighLowPage';
import BlackjackPage from './games/blackjack/BlackjackPage';
import RoulettePage from './games/roulette/RoulettePage';
import PokerGamePage from './games/poker/PokerGamePage';
// NotFound Page
import NotFoundPage from './components/NotFoundPage';

import './App.css';

export default function App() {
  return (
    <div className="content-main">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/loginconcept" element={<LoginConcept />} />
        <Route path="/" element={<Login />} /> {/* Login page is the entry point */}
        <Route path="/home" element={<HomePage />} /> {/* Main page after login */}

        {/* Spiele-Seiten */}
        <Route path="/game/slots" element={<SlotMachinePage />} />
        <Route path="/game/high-low" element={<HighLowPage />} />
        <Route path="/game/blackjack" element={<BlackjackPage />} />
        <Route path="/game/roulette" element={<RoulettePage />} />
        <Route path="/game/poker" element={<PokerGamePage />} />

        {/* Optionale Catch-All Route für nicht definierte Pfade */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}