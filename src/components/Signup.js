import React from "react";
import { useState } from "react";
import { app, auth1, db } from "../Dashboard/database";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

 const submit = async (e) => {
   e.preventDefault();
   try {
     const userCredential = await app
       .auth()
       .createUserWithEmailAndPassword(email, password);
     const user = userCredential.user;

     await user.updateProfile({
       displayName: name,
     });

    await setDoc(doc(db, "users", user.uid), {
       username: user.displayName,
       email: user.email,
     });

     toast.success("Registration successful!");
     navigate("/signin");
   } catch (error) {
     alert(error.message);
   }
 };

 

  return (
    <div>
      <div>
        <div>
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
            <h3>Register Here</h3>

            <label htmlFor="username">Details:</label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <input type="password" placeholder="Password" id="password" /> */}
            <input
              type="password"
              placeholder="Confirm Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={submit}>Register</button>
            <div className="text-center">
              <span className="cursor-pointer underline hover:text-blue-400">
                U had an account already?
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
