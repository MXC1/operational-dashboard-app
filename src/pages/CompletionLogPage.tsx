import React from 'react';
import './CompletionLogPage.css';

interface CompletionLogPageProps {
  completedTasks: { key: string; title: string; dueDate: string; completedDate: string }[];
}

const CompletionLogPage: React.FC<CompletionLogPageProps> = ({ completedTasks }) => {
  return (
    <div className="completion-log-page">
      <div className="completion-log">
        <h2>Completion Log</h2>
        <table className="completion-log-table">
          <thead>
            <tr>
              <th className="task-title-header">Task</th>
              <th className="task-date-header">Due Date</th>
              <th className="task-date-header">Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task) => (
              <tr key={task.key}>
                <td className="task-title">{task.title}</td>
                <td className="task-date">{task.dueDate}</td>
                <td className="task-date">{task.completedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletionLogPage;
