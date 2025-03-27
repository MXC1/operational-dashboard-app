import React, { useState } from 'react';
import './CompletionLogPage.css';

const CompletionLogPage: React.FC = () => {
  const [completedTasks] = useState([
    { title: 'Task 2', date: '2025-03-27' },
    { title: 'Task 4', date: '2025-04-01' },
  ]);

  return (
    <div className="completion-log-page">
      <div className="completion-log">
        <h2>Completion Log</h2>
        <ul>
          {completedTasks.map((task, index) => (
            <li key={index}>
              <span className="task-title">{task.title}</span>
              <span className="task-date">{task.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompletionLogPage;
