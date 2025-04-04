import React, { useEffect, useState } from "react";
import axios from 'axios';
import TaskGrid from "./components/TaskGrid";
import Navbar from "./components/Navbar";
import "./components/TaskGrid.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CompletionLogPage from "./pages/CompletionLogPage";

type Task = {
  key: string;
  title: string;
  processURL: string;
  category: string;
  dueDate: string;
  completedDate: string;
  completed: boolean;
  completedBy: string;
};

const App: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(taskList.filter(task => task.completed));
  const [userName, setUserName] = useState(() => {
    // Retrieve the user name from local storage or use a default value
    return localStorage.getItem("userName") || "Milo";
  });

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      const response = await axios.get(`https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev`);
      console.log(`Response data: ${JSON.stringify(response.data)}`);
      setTaskList(response.data);
      populateCompletionLog(response.data);
    };

    const populateCompletionLog = async (taskList: Task[]) => {
      const completedTasks = taskList.filter(task => task.completed);
      setCompletedTasks(completedTasks);
    };

    fetchAndPopulateTasks();
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = e.target.value;
    setUserName(selectedUser);
    localStorage.setItem("userName", selectedUser); // Save the selected user to local storage
  };

  const updateDynamoDBWithTask = async (updatedTask: Task) => {
      // Call the API to replace the task in DynamoDB
      axios.post("https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev", updatedTask, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Task updated in DynamoDB:", response.data);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const toggleTaskCompletion = async (taskKey: string) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) => {
        if (task.key === taskKey) {
          const updatedTask = {
            ...task,
            completed: !task.completed,
            completedDate: !task.completed ? new Date().toISOString().split("T")[0] : "",
            completedBy: !task.completed ? userName : "", // Set or remove completedBy
          };
  
          // Optimistically update the task locally
          if (updatedTask.completed) {
            setCompletedTasks((prevCompleted) => [...prevCompleted, updatedTask]);
          } else {
            setCompletedTasks((prevCompleted) =>
              prevCompleted.filter((completedTask) => completedTask.key !== taskKey)
            );
          }
  
          updateDynamoDBWithTask(updatedTask);
  
          return updatedTask;
        }
        return task;
      })
    );
  };
  

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <div className="user-dropdown">
          <select value={userName} onChange={handleUserChange}>
            <option value="Pedro">Pedro</option>
            <option value="Milo">Milo</option>
            <option value="Adi">Adi</option>
            <option value="Henry">Henry</option>
            <option value="Lewis">Lewis</option>
            <option value="Emma">Emma</option>
            <option value="Tubor">Tubor</option>
            <option value="Steve">Steve</option>
            <option value="Izaac">Izaac</option>
          </select>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<TaskGrid tasks={taskList} toggleTaskCompletion={toggleTaskCompletion} />} />
            <Route path="/completion-log" element={<CompletionLogPage completedTasks={completedTasks} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
