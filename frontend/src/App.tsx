// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import LoginConcept from './components/loginconcept';
import HomePage from './components/HomePage';

// Importiere die neuen Spieleseiten-Komponenten
import SlotMachinePage from './games/slots/SlotMachinePage';
import HighLowPage from './games/high-low/HighLowPage';
import BlackjackPage from './games/blackjack/BlackjackPage';
// Optional: Importiere eine NotFoundPage, falls du eine hast
// import NotFoundPage from './components/NotFoundPage';

import './App.css';

export default function App() {
  // Wichtiger Hinweis: Diese <Routes>-Komponente muss innerhalb eines
  // <BrowserRouter> (oder eines anderen Routers) in deiner übergeordneten
  // Komponente (üblicherweise src/main.tsx oder src/index.tsx) gerendert werden,
  // damit das Routing funktioniert. Da du bereits Routes verwendest, ist dies
  // wahrscheinlich schon der Fall.
  return (
    <div className="content-main">
      <Routes>
        {/* Bestehende Routen */}
        <Route path="/login" element={<Login />} />
        <Route path="/loginconcept" element={<LoginConcept />} />
        <Route path="/" element={<Login />} /> {/* Login page is the entry point */}
        <Route path="/home" element={<HomePage />} /> {/* Main page after login */}

        {/* === NEUE ROUTEN FÜR DIE SPIELE === */}
        {/* Diese Pfade korrespondieren mit den `Maps` Aufrufen in deiner HomePage.tsx */}
        <Route path="/game/slots" element={<SlotMachinePage />} />
        <Route path="/game/high-low" element={<HighLowPage />} />
        <Route path="/game/blackjack" element={<BlackjackPage />} />

        {/* Optionale Catch-All Route für nicht definierte Pfade */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}