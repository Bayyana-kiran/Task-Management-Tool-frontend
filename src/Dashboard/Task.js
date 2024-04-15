import React, { useEffect, useState } from "react";
import Popup from "../container/Popup";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./database";

function Task({ currentUser }) {
  const [buttonPopup, setButtonPopup] = useState(
    localStorage.getItem("buttonPopup") === "true" ? true : false
  );
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [editTaskId, setEditTaskId] = useState(""); // State to store the id of task being edited
  const [collaborators, setCollaborators] = useState("");
 
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState("");

  // Modify the collaborator selection dropdown change handler
  const handleCollaboratorChange = (e) => {
    setSelectedCollaboratorId(e.target.value);
  };

  const [task, setTask] = useState({
    title: "",
    priority: "High",
    dueDate: "",
    status: "Open",
    description: "",
    subTasks: [],
    collaborators:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value }); // Update the value directly
  };

  const handleSubtaskChange = (e, index) => {
    const { value } = e.target;
    const updatedSubtasks = [...task.subTasks];
    updatedSubtasks[index] = value;
    setTask({ ...task, subTasks: updatedSubtasks });
  };


  const addSubtask = () => {
    setTask({ ...task, subTasks: [...task.subTasks, ""] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Flatten subTasks array into a string
      const subTasksString = task.subTasks.join(";");

      // Create a new task object without the subTasks array
      const { subTasks, ...taskWithoutSubTasks } = task;

      // Add the task to Firestore
      const taskWithUser = {
        ...taskWithoutSubTasks,
        userId: currentUser.uid,
        subTasks: subTasksString, // Store subTasks as a string
      };

      await addDoc(collection(db, "tasks"), taskWithUser);

      setButtonPopup(false);
      setEditMode(false); // Exit edit mode after submission
      setEditTaskId(""); // Clear the edit task id
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };




  const updateTask = async (taskId, updatedTask) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updatedTask);
    // Update tasks state after updating the task in the database
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      let q;
      if (currentUser) {
        q = query(
          collection(db, "tasks"),
          // where("collaborators", "array-contains-any", [currentUser.uid])
          where("userId", "==", currentUser.uid)
        );
        
      } else {
        q = collection(db, "tasks");
      }
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



  const handleEdit = (taskId) => {
    // Find the task by taskId and set it to task state
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTask(taskToEdit);
    setButtonPopup(true); // Open the popup
    setEditMode(true); // Set edit mode to true
    setEditTaskId(taskId); // Set the task id being edited
  };

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollaborators(usersData);
      } catch (error) {
        console.error("Error fetching collaborators: ", error);
      }
    };

    fetchCollaborators();
  }, []);

  

  return (
    <div>
      <header className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <header>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                <span id="_text_content">Task Manager</span>
              </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => setButtonPopup(true)}
              >
                <span id="_text_content">View Tasks</span>
              </button>
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <div className="overflow-auto max-h-full">
                  <form
                    id="add-task-form"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-6xl mx-auto px-4 py-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="col-span-1">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={task.title}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Priority
                      </label>
                      <select
                        value={task.priority}
                        onChange={handleChange}
                        id="priority"
                        name="priority"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="due-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        id="due-date"
                        value={task.dueDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="sub-tasks"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sub-tasks
                      </label>
                      <div
                        id="sub-tasks-container"
                        className="flex flex-wrap gap-2"
                      >
                        {task.subTasks.map((subtask, index) => (
                          <input
                            key={index}
                            type="text"
                            name={`sub-tasks[${index}]`}
                            value={subtask}
                            onChange={(e) => handleSubtaskChange(e, index)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Sub-task"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        id="add-sub-task"
                        onClick={addSubtask}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
                      >
                        <i className="fas fa-plus mr-2"></i> Add Sub-task
                      </button>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="collaborators"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Collaborators:
                        {collaborators.length > 0 && (
                          <select
                            value={selectedCollaboratorId}
                            onChange={handleCollaboratorChange}
                          >
                            <option value="">Select collaborator</option>
                            {collaborators.map((collaborator) => (
                              <option
                                key={collaborator.id}
                                value={collaborator.id}
                              >
                                {collaborator.username}
                              </option>
                            ))}
                          </select>
                        )}
                      </label>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Task
                      </button>
                    </div>
                  </form>
                </div>
              </Popup>
            </div>
          </div>
        </div>
      </header>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative group p-6 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl"
              >
                {/* Task details */}
                <h1 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
                  {task.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-300">
                  Priority: {task.priority}
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  Due Date: {task.dueDate}
                </p>
                <p className="text-gray-500 dark:text-gray-300">
                  Status: {task.status}
                </p>

                {/* Edit and Delete buttons */}
                <div className="absolute top-0 right-0 hidden group-hover:flex flex-col gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Task;






