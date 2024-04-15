import React, { useState, useEffect } from "react";
import { auth, db } from "./database";
import { setDoc, doc } from "firebase/firestore";

const FirebaseAuthentication = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Logged in as:", user.email);
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        alert("Logged out");
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  };

  const handleWriteData = async () => {
    try {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      const docRef = await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
      });
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleWriteData}>Write Data to Firestore</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default FirebaseAuthentication;
