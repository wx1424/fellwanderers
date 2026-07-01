import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from "../../firebase";

interface LoginPopupProps {
  onClose: () => void;
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignInWithEmailAndPassword = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onClose();
    })
    .catch(() => setError("Committee Sign-In Failed"));
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white w-1/3 p-4 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded px-4 py-2 w-full"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded"
          onClick={handleSignInWithEmailAndPassword}
        >
          Sign In
        </button>
        <button
          className="px-2 mt-4 text-sm text-gray-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}