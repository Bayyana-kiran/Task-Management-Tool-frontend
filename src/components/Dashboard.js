import React, { useState } from "react";
import Home from "../Dashboard/Home";
import Calender from "../Dashboard/Calender";
import Analysis from "../Dashboard/Analysis";
import Project from "../Dashboard/Project";
import Task from "../Dashboard/Task";
import { useEffect } from "react";
import {app1, auth, db1} from "../Dashboard/database";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [user, setUser] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth).then(val=>{
      navigate("/");
    })
    
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen">
      {/* <button onClick={logout}>logout</button> */}
      <div className="w-1/4 bg-white border-r">
        <div className="max-w-xs font-sans antialiased">
          <div className="px-4 py-6">
            <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              Task Manager
            </span>
            <ul className="mt-6 space-y-1">
              <li>
                <Link
                  className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === "Home" ? "font-bold" : ""
                  }`}
                  onClick={() => handlePageChange("Home")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <details>
                  <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <span className="text-sm font-medium">My Tasks</span>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4">
                    <li>
                      <Link
                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          currentPage === "Task" ? "font-bold" : ""
                        }`}
                        onClick={() => handlePageChange("Task")}
                      >
                        Tasks
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          currentPage === "Project" ? "font-bold" : ""
                        }`}
                        onClick={() => handlePageChange("Project")}
                      >
                        Projects
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <Link
                  className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === "Calendar" ? "font-bold" : ""
                  }`}
                  onClick={() => handlePageChange("Calendar")}
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === "Analysis" ? "font-bold" : ""
                  }`}
                  onClick={() => handlePageChange("Analysis")}
                >
                  Analysis
                </Link>
              </li>
            </ul>
          </div>
          <div className="fixed inset-x-0 bottom-0 border-t flex justify-between items-center border-gray-100">
            <a className="flex items-center gap-3 bg-white p-4 hover:bg-gray-50">
              <img
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
                src="https://source.unsplash.com/100x100/?avatar"
              />

              <div>
                <p className="text-xs">
                  <strong className="block font-medium">
                    Task Manager Pro
                  </strong>
                  <span>support@taskmanager.com</span>
                  <button
                    className="block rounded-lg bg-red-600 px-1 py-1 text-xs font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="w-3/4 overflow-y-auto">
        {currentPage === "Home" && <Home />}
        {currentPage === "Task" && <Task currentUser={user} />}
        {currentPage === "Project" && <Project />}
        {currentPage === "Calendar" && <Calender currentUser={user} />}
        {currentPage === "Analysis" && <Analysis />}
      </div>
    </div>
  );
}

export default Dashboard;
