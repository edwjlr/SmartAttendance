import React, { useState } from 'react';
import { auth } from '../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    try {
      // Use the function with the auth object and credentials
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
    } catch (error) {
      console.error("Error signing in: ", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
