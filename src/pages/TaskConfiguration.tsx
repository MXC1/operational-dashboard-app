import React from "react";
import "./TaskConfiguration.css";

type TaskConfigurationProps = {
  taskConfigurations: {
    key: string;
    title: string;
    team: string;
    processURL: string;
    category: string;
    weekDay: string[];
  }[];
};

const TaskConfiguration: React.FC<TaskConfigurationProps> = ({ taskConfigurations }) => {
  return (
    <div className="task-configuration-container">
      <h1>Task Configurations</h1>
      <table className="task-configuration-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Team</th>
            <th>Category</th>
            <th>Process URL</th>
            <th>Week Days</th>
          </tr>
        </thead>
        <tbody>
          {taskConfigurations.map((config) => (
            <tr key={config.key}>
              <td>{config.title}</td>
              <td>{config.team}</td>
              <td>{config.category}</td>
              <td>
                <a href={config.processURL} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>{config.weekDay.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskConfiguration;
