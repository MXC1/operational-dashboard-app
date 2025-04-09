import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskGrid from "./pages/TaskGrid";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CompletionLogPage from "./pages/CompletionLogPage";
import "./components/LoadingSpinner.css"; // Import spinner styles
import NewTaskForm from "./pages/newTaskForm";
import HeaderBar from "./components/HeaderBar";
import TaskConfiguration from "./pages/TaskConfiguration"; // Import TaskConfiguration

type Task = {
  key: string;
  title: string;
  team: string;
  processURL: string;
  category: string;
  dueDate: string;
  completedDate: string;
  completed: boolean;
  completedBy: string;
};

type Team = {
  key: string;
  teamName: string;
  members: string[];
}

type TaskConfigurationType = {
  key: string;
  title: string;
  team: string;
  processURL: string;
  category: string;
  weekDay: string[];
};

const App: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(() => {
    // Retrieve the last selected team from local storage or use null
    return localStorage.getItem("selectedTeam");
  });

  const [userName, setUserName] = useState(() => {
    // Retrieve the user name from local storage or use a default value
    return localStorage.getItem("userName") || "<Choose>";
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [taskConfigurations, setTaskConfigurations] = useState<TaskConfigurationType[]>([]);

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      setIsLoading(true); // Set loading to true before fetching
      console.log('Fetching tasks...');
      try {
        const response = await axios.get(
          `https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev`
        );
        console.log('Tasks fetched successfully:', response.data);
        setTaskList(response.data);
        setFilteredTasks(response.data); // Initialize filtered tasks
        await populateCompletionLog(response.data);
        await getAndSetTeams();
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    const populateCompletionLog = async (taskList: Task[]) => {
      console.log('Populating completion log with tasks:', taskList);
      const completedTasks = taskList
        .filter((task) => task.completed)
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); // Sort by due date descending
      setCompletedTasks(completedTasks);
    };

    const getAndSetTeams = async () => {
      // Call axios get to fetch teams from the API
      console.log('Fetching teams...');
      try {
        const response = await axios.get(
          `https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev/teams`
        );
        console.log('Teams fetched successfully:', response.data);
        setTeams(response.data);
      } catch (error: any) {
        console.error('Error fetching teams:', error.response?.data || error.message);
      }
    }

    const fetchTaskConfigurations = async () => {
      console.log("Fetching task configurations...");
      try {
        const response = await axios.get(
          "https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev/new-task-configuration"
        );
        console.log("Task configurations fetched successfully:", response.data);
        const configurations = response.data.map((config: any) => ({
          key: config.key.S,
          title: config.title.S,
          team: config.team.S,
          processURL: config.processURL.S,
          category: config.category.S,
          weekDay: config.weekDay.SS,
        }));
        setTaskConfigurations(configurations);
      } catch (error) {
        console.error("Error fetching task configurations:", error);
      }
    };

    fetchAndPopulateTasks();
    fetchTaskConfigurations();
  }, []);


  useEffect(() => {
    if (selectedTeam) {
      setFilteredTasks(taskList.filter((task) => task.team === selectedTeam));
      setCompletedTasks(
        taskList
          .filter((task) => task.completed && task.team === selectedTeam)
          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      );
    } else {
      setFilteredTasks(taskList);
      setCompletedTasks(
        taskList
          .filter((task) => task.completed)
          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      );
    }
  }, [selectedTeam, taskList]);

  const filteredTaskConfigurations = selectedTeam
    ? taskConfigurations.filter((config) => config.team === selectedTeam)
    : taskConfigurations;

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = e.target.value;
    console.log('User changed to:', selectedUser);
    setUserName(selectedUser);
    localStorage.setItem("userName", selectedUser); // Save the selected user to local storage
  };

  const updateDynamoDBWithTask = async (updatedTask: Task) => {
    console.log('Updating task in DynamoDB:', updatedTask);
    axios
      .post(
        "https://0a90f42pjl.execute-api.eu-west-2.amazonaws.com/dev",
        updatedTask,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("Task updated in DynamoDB:", response.data);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const toggleTaskCompletion = async (taskKey: string) => {
    console.log('Toggling task completion for taskKey:', taskKey);
    setTaskList((prevTasks) =>
      prevTasks.map((task) => {
        if (task.key === taskKey) {
          const updatedTask = {
            ...task,
            completed: !task.completed,
            completedDate: !task.completed
              ? new Date().toISOString().split("T")[0]
              : "",
            completedBy: !task.completed ? userName : "",
          };

          console.log('Updated task:', updatedTask);

          if (updatedTask.completed) {
            setCompletedTasks((prevCompleted) => [
              ...prevCompleted,
              updatedTask,
            ]);
          } else {
            setCompletedTasks((prevCompleted) =>
              prevCompleted.filter(
                (completedTask) => completedTask.key !== taskKey
              )
            );
          }

          updateDynamoDBWithTask(updatedTask);

          return updatedTask;
        }
        return task;
      })
    );
  };

  const filterByTeam = (team: string) => {
    console.log("Filtering tasks by team:", team);
    const newSelectedTeam = team === selectedTeam ? null : team;
    setSelectedTeam(newSelectedTeam);
    localStorage.setItem("selectedTeam", newSelectedTeam || "");
    
    // Reset username to default when the team changes
    const defaultUserName = "<Choose>";
    setUserName(defaultUserName);
    localStorage.setItem("userName", defaultUserName);
  };

  return (
    <BrowserRouter>
      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div />
      )}
      <div className="app-container">
        <HeaderBar
          teamNames={teams.map((team) => team.teamName)}
          filterByTeam={filterByTeam}
          selectedTeam={selectedTeam}
        />
        {selectedTeam && (
          <>
            <Navbar />
            <div className="user-dropdown">
              <select value={userName} onChange={handleUserChange}>
                <option value="<Choose>">{"<Choose>"}</option>
                {teams
                  .find((team) => team.teamName === selectedTeam)
                  ?.members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
              </select>

            </div>
            <div className="content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <TaskGrid
                      tasks={filteredTasks}
                      toggleTaskCompletion={toggleTaskCompletion}
                      username={userName}
                      teamName={selectedTeam} // Pass selected team name
                    />
                  }
                />
                <Route
                  path="/completion-log"
                  element={
                    <CompletionLogPage
                      completedTasks={completedTasks}
                      teamName={selectedTeam} // Pass selected team name
                    />
                  }
                />
                <Route
                  path="/new-task-form"
                  element={<NewTaskForm selectedTeam={selectedTeam} />}
                />
                <Route
                  path="/task-configuration"
                  element={<TaskConfiguration taskConfigurations={filteredTaskConfigurations} />}
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
