import React from 'react';
import './CompletionLogPage.css';

interface CompletionLogPageProps {
  completedTasks: { id: string; title: string; date: string }[];
}

const CompletionLogPage: React.FC<CompletionLogPageProps> = ({ completedTasks }) => {
  console.log(`Rendering CompletionLogPage with tasks:`, completedTasks);

  return (
    <div className="completion-log-page">
      <div className="completion-log">
        <h2>Completion Log</h2>
        <div className="completion-log-header">
          <span className="task-title-header">Task</span>
          <span className="task-date-header">Date Completed</span>
        </div>
        <ul>
          {completedTasks.map((task) => (
            <li key={task.id}>
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
