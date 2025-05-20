// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';    // Assuming this is your login component
import LoginConcept from './components/loginconcept';    // Assuming this is your login component
import HomePage from './components/HomePage'; // Assuming this is your main page component
import './App.css';

export default function App() {
  return (
    <div className="content-main">
      <Routes>
        {/* Route for the Login page - often the default or a specific path like /login */}
        <Route path="/login" element={<Login />} />
        <Route path="/loginconcept" element={<LoginConcept />} />

        {/* Route for the Home Page (or main page) */}
        {/* You might want this to be the root path AFTER login,
            or a specific path like /home or /dashboard.
            If /login is your initial page, then perhaps / is your main page,
            or you create a dedicated /home path. Let's use /home for clarity.
        */}
        <Route path="/home" element={<HomePage />} />

        {/*
          Optional: If you want the root path to be the login page initially,
          and then after login redirect to /home, you could set it up like this.
          Or, if you want the root path to be a protected route that redirects
          to /login if not authenticated, that's a more advanced setup.

          For now, let's assume you have a distinct /login path and a /home path.
          If you want the login page to be at "/", you can keep your original:
          <Route path="/" element={<Login />} />
          And then your HomePage could be:
          <Route path="/home" element={<HomePage />} />
          Or if your HomePage should be at the root AFTER login, you would
          typically handle this with protected routes (see notes below).

          Let's go with a common scenario:
          - /login for the login page
          - / for the main HomePage (assuming you'll protect this route later)
        */}
        {/* <Route path="/" element={<HomePage />} /> {/* If HomePage is at the root */}

        {/* Let's refine based on the common pattern: login at /login, main app at / */}
        {/* If you want to keep Login at the root initially, that's fine,
            but then after login, you'll navigate to a different path for HomePage.

            Let's go with this structure:
            - Initial visit to "/" shows Login
            - After login, navigate to "/home" which shows HomePage
        */}
        <Route path="/" element={<Login />} /> {/* Login page is the entry point */}
        <Route path="/home" element={<HomePage />} /> {/* Main page after login */}

      </Routes>
    </div>
  );
}