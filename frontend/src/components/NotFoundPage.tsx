// src/components/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  backgroundColor: '#f8f9fa'
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)', // Responsive font size
  color: '#dc3545',
  marginBottom: '0.5em'
};

const textStyle: React.CSSProperties = {
  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
  color: '#6c757d',
  marginBottom: '1.5em'
};

const linkStyle: React.CSSProperties = {
  padding: '10px 25px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
  transition: 'background-color 0.3s ease'
};

// Simple hover effect can be done with pseudo-classes in a CSS file,
// or inline with onMouseOver/onMouseOut for JS-driven styles if needed.

export default function NotFoundPage() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={textStyle}>Oops! Nothing to see here...</p>
      <Link to="/home" style={linkStyle}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}