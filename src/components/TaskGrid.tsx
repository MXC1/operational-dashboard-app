import React from "react";

// Task Type
interface Task {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  completed: boolean;
}

// Component Props
interface TaskGridProps {
  tasks: Task[];
  toggleTaskCompletion: (taskId: string) => void;
}

// Status & Category Lists
const STATUSES = ["Overdue", "Due Today", "Due Soon", "Completed"];

const getDueStatus = (task: Task): string => {
  const today = new Date();
  const dueDate = new Date(task.date);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  if (task.completed) return "Completed";
  if (dueDate.toDateString() === today.toDateString()) return "Due Today";
  if (dueDate < today) return "Overdue";
  if (dueDate >= startOfWeek && dueDate <= endOfWeek) return "Due Soon";
  return "";
};

// Organize tasks into a Map<Category, Map<DueStatus, Task[]>>
const groupTasks = (tasks: Task[]) => {
  const grouped = new Map<string, Map<string, Task[]>>();

  tasks.forEach((task) => {
    const category = task.category;
    const status = getDueStatus(task);

    if (!grouped.has(category)) grouped.set(category, new Map());
    if (!grouped.get(category)?.has(status)) grouped.get(category)?.set(status, []);

    grouped.get(category)?.get(status)?.push(task);
  });

  return grouped;
};

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, toggleTaskCompletion }) => {
  const groupedTasks = groupTasks(tasks);
  const categories = Array.from(groupedTasks.keys());

  return (
    <div>
      <h1>Task Grid</h1>
      <div className="task-grid" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}>
        {/* First empty cell for alignment */}
        <div className="header empty"></div>

        {/* Headers (Categories) */}
        {categories.map((category) => (
          <div key={category} className="header">{category}</div>
        ))}

        {/* Rows (Statuses) */}
        {STATUSES.map((status) => (
          <>
            <div className="status-label">{status}</div>
            {categories.map((category) => (
              <div key={`${category}-${status}`} className="task-container">
                {groupedTasks.get(category)?.get(status)?.map((task) => (
                  <div
                    key={task.id}
                    className={`task ${status.toLowerCase().replace(" ", "-")}`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <strong>{task.title}</strong>
                    <p>{task.subtitle}</p>
                    <p>{task.date}</p>
                  </div>
                )) || <div className="task empty"></div>}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default TaskGrid;
