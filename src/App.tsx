import React, { useState } from "react";
import TaskGrid from "./components/TaskGrid";
import Navbar from "./components/Navbar";
import "./components/TaskGrid.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CompletionLogPage from "./pages/CompletionLogPage";

const tasks = [
    { id: "1", title: "Task 1", subtitle: "Subtitle 1", category: "Monitoring and Incident Management", date: "2025-03-17", completed: false },
    { id: "2", title: "Task 2", subtitle: "Subtitle 2", category: "Monitoring and Incident Management", date: "2025-03-27", completed: true },
    { id: "3", title: "Task 3", subtitle: "Subtitle 3", category: "Release Management", date: "2025-03-29", completed: false },
    { id: "4", title: "Task 4", subtitle: "Subtitle 4", category: "Release Management", date: "2025-04-01", completed: true },
    { id: "5", title: "Task 5", subtitle: "Subtitle 5", category: "NBO Operations", date: "2025-02-27", completed: false },
    { id: "6", title: "Task 6", subtitle: "Subtitle 6", category: "Monitoring and Incident Management", date: "2025-04-03", completed: false },
    { id: "7", title: "Task 7", subtitle: "Subtitle 7", category: "NBO Operations", date: "2025-04-04", completed: false },
    { id: "8", title: "Task 8", subtitle: "Subtitle 8", category: "NBO Operations", date: "2025-04-04", completed: false },
    { id: "9", title: "Task 9", subtitle: "Subtitle 9", category: "Release Management", date: "2025-04-01", completed: true },
];

const App: React.FC = () => {
    const [taskList, setTaskList] = useState(tasks);
    const [completedTasks, setCompletedTasks] = useState(tasks.filter(task => task.completed));

    const toggleTaskCompletion = (taskId: string) => {
        setTaskList((prevTasks) =>
            prevTasks.map((task) => {
                if (task.id === taskId) {
                    const updatedTask = { ...task, completed: !task.completed };
                    if (updatedTask.completed) {
                        setCompletedTasks((prevCompleted) => [...prevCompleted, updatedTask]);
                    } else {
                        setCompletedTasks((prevCompleted) =>
                            prevCompleted.filter((completedTask) => completedTask.id !== taskId)
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
