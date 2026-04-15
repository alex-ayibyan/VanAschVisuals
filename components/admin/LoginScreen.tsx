'use client';

import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface LoginScreenProps {
  onLogin: () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Ongeldig e-mailadres.',
  'auth/user-disabled': 'Dit account is uitgeschakeld.',
  'auth/user-not-found': 'Geen account gevonden met dit e-mailadres.',
  'auth/wrong-password': 'Onjuist wachtwoord.',
  'auth/too-many-requests': 'Te veel pogingen. Probeer het later opnieuw.',
  'auth/network-request-failed': 'Netwerkfout. Controleer je verbinding.',
  'auth/invalid-credential': 'Ongeldige inloggegevens.',
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(ERROR_MESSAGES[code] ?? 'Er is een fout opgetreden. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">Portfolio</div>
        <div className="login-sub">Beheer</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="E-mailadres"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ letterSpacing: '0.05em' }}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Wachtwoord"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ letterSpacing: '0.2em' }}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Bezig…' : 'Inloggen'}
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
