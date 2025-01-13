import './styles/App.css';
import React, { useEffect, useState } from 'react';
import { auth } from './config/firebase-config';
import SignIn from './components/SignIn';
import AttendanceRecords from './components/AttendanceRecords';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (!user) {
    // User is not signed in, show the sign-in form
    return <SignIn />;
  }
  
  // User is signed in, show the application
  return (
    <div className="App">
      <header className="App-header">
        {/* Application content for authenticated users */}
        <h1>Classroom Attendance Management</h1>
        {/* AddAttendanceForm allows adding new attendance records */}
        <AttendanceRecords />
        {/* Sign Out Button */}
        <button onClick={() => auth.signOut()}>Sign Out</button>
      </header>
    </div>
  );
}

export default App;
