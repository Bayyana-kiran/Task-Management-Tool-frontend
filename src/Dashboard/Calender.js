import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { where, query, collection, getDocs } from "firebase/firestore";
import Popup from "../container/Popup";


const firebaseConfig = {
  apiKey: "AIzaSyDLB9-XvYGG-UNlCUY1pr1awAAKZt-vIfE",
  authDomain: "task-manager-d0bd5.firebaseapp.com",
  databaseURL: "https://task-manager-d0bd5-default-rtdb.firebaseio.com",
  projectId: "task-manager-d0bd5",
  storageBucket: "task-manager-d0bd5.appspot.com",
  messagingSenderId: "721123563194",
  appId: "1:721123563194:web:dbf3e6c205b33f4a87d483",
  measurementId: "G-KSRQSWW5Y4",
};


const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);

function CalendarPage({ currentUser }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitles, setTaskTitles] = useState([]);
  const [buttonPopup, setButtonPopup] = useState();
  const [dotColors, setDotColors] = useState([]);

  // useEffect to generate random colors when the component mounts
  useEffect(() => {
    // Generate random colors for each dot and store them in the dotColors state
    const colors = Array.from({ length: 31 }, () => getRandomColor());
    setDotColors(colors);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", currentUser.uid)
        ); // Query tasks belonging to the current user
        const querySnapshot = await getDocs(q);
        const tasksData = [];
        querySnapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() });
        });
        
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [currentUser]);

  


  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setButtonPopup(true);
    const selectedTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getDate() === day &&
        dueDate.getMonth() === currentDate.getMonth() &&
        dueDate.getFullYear() === currentDate.getFullYear()
      );
    });
    setTaskTitles(selectedTasks.map((task) => task.title));
    
  };


  // Extract year and month from the current date
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Generate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  function getMonthInTextFormat() {
    const monthNumber = currentDate.getMonth() + 1;

    switch (monthNumber) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "Unknown";
    }
  }


  return (
    <div>
      <div className="container mx-auto mt-10">
        <div className="wrapper bg-white rounded shadow w-full ">
          <div className="header flex justify-between border-b p-2">
            <button
              className="block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring"
              onClick={handlePrevMonth}
            >
              Prev
            </button>
            <span className="text-lg font-bold">
              {getMonthInTextFormat()} {currentYear}
            </span>
            <button
              className="block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring"
              onClick={handleNextMonth}
            >
              Next
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border-r h-10 w-10 text-center">Sun</th>
                <th className="p-2 border-r h-10 w-10 text-center">Mon</th>
                <th className="p-2 border-r h-10 w-10 text-center">Tue</th>
                <th className="p-2 border-r h-10 w-10 text-center">Wed</th>
                <th className="p-2 border-r h-10 w-10 text-center">Thu</th>
                <th className="p-2 border-r h-10 w-10 text-center">Fri</th>
                <th className="p-2 h-10 w-10 text-center">Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.ceil((daysInMonth + firstDayOfMonth) / 7) },
                (row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 7 }, (cell, cellIndex) => {
                      const day =
                        rowIndex * 7 + cellIndex + 1 - firstDayOfMonth;
                      const tasksForDay = tasks.filter(
                        (task) =>
                          parseInt(task.dueDate.substring(8, 10)) === day &&
                          task.dueDate.substring(5, 7) ===
                            (currentMonth < 10
                              ? "0" + currentMonth
                              : currentMonth.toString()) &&
                          task.dueDate.substring(0, 4) ===
                            currentYear.toString()
                      );
                      return (
                        <td
                          key={cellIndex}
                          className={`border p-1 h-40 w-10 text-center ${
                            day > 0 && day <= daysInMonth
                              ? "hover:bg-gray-300 cursor-pointer"
                              : ""
                          } ${
                            day === selectedDate ? "bg-gray-300 text-white" : ""
                          }`}
                          onClick={() => handleDateClick(day)}
                        >
                          {day > 0 && day <= daysInMonth && (
                            <span className="text-gray-500">{day}</span>
                          )}
                          {tasksForDay.length > 0 && (
                            <div>
                              {tasksForDay.map((task, index) => (
                                <div
                                  key={index}
                                  className="dot"
                                  style={{
                                    background: dotColors[index],
                                    marginTop: "3px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                  }}
                                ></div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h2 className="font-bold">
          Tasks for {selectedDate}/{currentMonth}/{currentYear} :
        </h2>

        <ul>
          {taskTitles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </Popup>
    </div>
  );
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default CalendarPage;