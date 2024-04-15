import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes

import Body from "./components/Body";
import Dashboard from "./components/Dashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Home from "./Dashboard/Home";
import Project from "./Dashboard/Project";
import Analysis from "./Dashboard/Analysis";
import Calender from "./Dashboard/Calender";
import Task from "./Dashboard/Task";


function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/project" element={<Project />} />
        <Route path="/task" element={<Task />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/home" element={<Home />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Body />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
