import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

export default function App() {
  return (
    <PlayerProvider>
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/signin"  element={<SignIn />} />
        <Route path="/signup"  element={<SignUp />} />
        <Route path="/home"    element={<Home />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </PlayerProvider>
  );
}
