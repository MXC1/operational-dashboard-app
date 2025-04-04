import React, { useEffect, useState } from "react";
import axios from 'axios';
import TaskGrid from "./components/TaskGrid";
import Navbar from "./components/Navbar";
import "./components/TaskGrid.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CompletionLogPage from "./pages/CompletionLogPage";

// const tasks = [
//     { key: "1", title: "Task 1", subtitle: "Subtitle 1", category: "Monitoring and Incident Management", dueDate: "2025-03-17", completedDate: "", completed: false },
//     { key: "2", title: "Task 2", subtitle: "Subtitle 2", category: "Monitoring and Incident Management", dueDate: "2025-03-27", completedDate: "2025-04-03", completed: true },
//     { key: "3", title: "Task 3", subtitle: "Subtitle 3", category: "Release Management", dueDate: "2025-03-29", completedDate: "", completed: false },
//     { key: "4", title: "Task 4", subtitle: "Subtitle 4", category: "Release Management", dueDate: "2025-04-01", completedDate: "2025-04-03", completed: true },
//     { key: "5", title: "Task 5", subtitle: "Subtitle 5", category: "NBO Operations", dueDate: "2025-02-27", completedDate: "", completed: false },
//     { key: "6", title: "Task 6", subtitle: "Subtitle 6", category: "Monitoring and Incident Management", dueDate: "2025-04-03", completedDate: "", completed: false },
//     { key: "7", title: "Task 7", subtitle: "Subtitle 7", category: "NBO Operations", dueDate: "2025-04-05", completedDate: "", completed: false },
//     { key: "8", title: "Task 8", subtitle: "Subtitle 8", category: "NBO Operations", dueDate: "2025-04-04", completedDate: "", completed: false },
//     { key: "9", title: "Task 9", subtitle: "Subtitle 9", category: "Release Management", dueDate: "2025-04-01", completedDate: "2025-03-28", completed: true },
// ];

type Task = {
  key: string;
  title: string;
  subtitle: string;
  category: string;
  dueDate: string;
  completedDate: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(taskList.filter(task => task.completed));

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


  const toggleTaskCompletion = (taskKey: string) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) => {
        if (task.key === taskKey) {
          const updatedTask = {
            ...task,
            completed: !task.completed,
            completedDate: !task.completed ? new Date().toISOString().split("T")[0] : ""
          };
          if (updatedTask.completed) {
            setCompletedTasks((prevCompleted) => [...prevCompleted, updatedTask]);
          } else {
            setCompletedTasks((prevCompleted) =>
              prevCompleted.filter((completedTask) => completedTask.key !== taskKey)
            );
          }
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
