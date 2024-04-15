import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { app, auth, provider } from "./FirebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { app2, auth1, db } from "../Dashboard/database";

function Signin() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleclick = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      const userData = data.user; // Correctly capture the user data
      setValue(userData.email);
      toast.success("Login successful!");
      localStorage.setItem("email", userData.email);

      if (!userData) {
        console.error("User data not available.");
        return;
      }

      // Add user data to Firestore
       await setDoc(doc(db, "users", userData.uid), {
        username: userData.displayName,
        email: userData.email,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error: ", error);
    }
  };



  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const submit=async(e)=>{
    e.preventDefault();
    try{
       const user = await app.auth().signInWithEmailAndPassword(email, password);
         if(user){
            setValue(true);
         }
         toast.success("Registration successful!");
         navigate("/dashboard");
    }
    catch(error){
      toast.error(error);
    }
  }
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setValue(userEmail);
    }
  }, []);

  return (
    <>
      <div className="bg-blue-900">
        <div className="bg-blue-900">
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap"
            rel="stylesheet"
          />
          {/*Stylesheet*/}
          <style
            media="screen"
            dangerouslySetInnerHTML={{
              __html:
                "\n      *,\n*:before,\n*:after{\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n}\nbody{\n    background-color: #111827;\n}\n.background{\n    width: 430px;\n    height: 520px;\n    position: absolute;\n    transform: translate(-50%,-50%);\n    left: 50%;\n    top: 50%;\n}\n.background .shape{\n    height: 200px;\n    width: 200px;\n    position: absolute;\n    border-radius: 50%;\n}\n.shape:first-child{\n    background: linear-gradient(\n       ,\n       \n    );\n    left: -80px;\n    top: -80px;\n}\n.shape:last-child{\n    background: linear-gradient(\n        to right,\n   ,\n        \n    );\n    right: -30px;\n    bottom: -80px;\n}\nform{\n    height: 520px;\n    width: 400px;\n    background-color: rgba(255,255,255,0.13);\n    position: absolute;\n    transform: translate(-50%,-50%);\n    top: 50%;\n    left: 50%;\n    border-radius: 10px;\n    backdrop-filter: blur(10px);\n    border: 2px solid rgba(255,255,255,0.1);\n    box-shadow: 0 0 40px rgba(8,7,16,0.6);\n    padding: 50px 35px;\n}\nform *{\n    font-family: 'Poppins',sans-serif;\n    color: #ffffff;\n    letter-spacing: 0.5px;\n    outline: none;\n    border: none;\n}\nform h3{\n    font-size: 32px;\n    font-weight: 500;\n    line-height: 42px;\n    text-align: center;\n}\nlabel{\n    display: block;\n    margin-top: 30px;\n    font-size: 16px;\n    font-weight: 500;\n}\ninput{\n    display: block;\n    height: 50px;\n    width: 100%;\n    background-color: rgba(255,255,255,0.07);\n    border-radius: 3px;\n    padding: 0 10px;\n    margin-top: 8px;\n    font-size: 14px;\n    font-weight: 300;\n}\n::placeholder{\n    color: #e5e5e5;\n}\nbutton{\n    margin-top: 50px;\n    width: 100%;\n    background-color: #ffffff;\n    color: #080710;\n    padding: 15px 0;\n    font-size: 18px;\n    font-weight: 600;\n    border-radius: 5px;\n    cursor: pointer;\n}\n.social{\n  margin-top: 30px;\n  display: flex;\n}\n.social div{\n  background: red;\n  width: 150px;\n  border-radius: 3px;\n  padding: 5px 10px 10px 5px;\n  background-color: rgba(255,255,255,0.27);\n  color: #eaf0fb;\n  text-align: center;\n}\n.social div:hover{\n  background-color: rgba(255,255,255,0.47);\n}\n.social .fb{\n  margin-left: 25px;\n}\n.social i{\n  margin-right: 4px;\n}\n.close-btn {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  cursor: pointer;\n  color: #ffffff;\n  font-size: 24px;\n}\n    ",
            }}
          />

          <form>
            <span className="close-btn">&times;</span>
            <h3>Login Here</h3>
            <div className="social">
              <div className="fb">
                <i className="fab fa-google" onClick={handleclick} />
              </div>
              <div className="fb">
                <i className="fab fa-facebook" />
              </div>
            </div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Email or Phone"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={submit}>Log In</button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Signin;
