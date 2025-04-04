import React from "react";

// Task Type
interface Task {
  key: string; // Changed from id to key
  title: string;
  processURL: string;
  category: string;
  dueDate: string;
  completedDate: string;
  completed: boolean;
}

// Component Props
interface TaskGridProps {
  tasks: Task[];
  toggleTaskCompletion: (taskKey: string) => void; // Updated to use key
}

// Status & Category Lists
const STATUSES = ["Overdue", "Due Today", "Due Soon", "Completed"];

const getDueStatus = (task: Task): string => {
  const today = new Date();
  const dueDate = new Date(task.dueDate);

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayOfMonth = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    dayOfMonth % 10 === 1 && dayOfMonth !== 11
      ? "st"
      : dayOfMonth % 10 === 2 && dayOfMonth !== 12
        ? "nd"
        : dayOfMonth % 10 === 3 && dayOfMonth !== 13
          ? "rd"
          : "th";

  return `${day} ${dayOfMonth}${suffix} ${month} ${year}`;
};

// Organize tasks into a Map<Category, Map<DueStatus, Task[]>>
const groupTasks = (tasks: Task[]) => {
  // Sort tasks by date in ascending order
  const sortedTasks = tasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const grouped = new Map<string, Map<string, Task[]>>();

  sortedTasks.forEach((task) => {
    const category = task.category;
    const status = getDueStatus(task);

    if (!grouped.has(category)) grouped.set(category, new Map());
    if (!grouped.get(category)?.has(status))
      grouped.get(category)?.set(status, []);

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
      <div
        className="task-grid"
        style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}
      >
        {/* First empty cell for alignment */}
        <div className="header empty"></div>

        {/* Headers (Categories) */}
        {categories.map((category) => (
          <div key={category} className="header">
            {category}
          </div>
        ))}

        {/* Rows (Statuses) */}
        {STATUSES.map((status) => (
          <React.Fragment key={status}>
            {" "}
            {/* Added key prop */}
            <div className="status-label">{status}</div>
            {categories.map((category) => (
              <div key={`${category}-${status}`} className="task-container">
                {groupedTasks
                  .get(category)
                  ?.get(status)
                  ?.map((task) => (
                    <div
                      key={task.key} // Updated to use key
                      className={`task ${status.toLowerCase().replace(" ", "-")}`}
                    >
                      <div className="task-left">
                        <strong>{task.title}</strong>
                        <p>Due: {formatDate(task.dueDate)}</p>
                        {task.completedDate && (
                          <p>Completed: {formatDate(task.completedDate)}</p>
                        )}
                      </div>
                      <div className="task-right">
                        {task.processURL && (
                          <button
                            className="process-button"
                            onClick={() =>
                              window.open(task.processURL, "_blank")
                            }
                          >
                            Link to Process
                          </button>
                        )}
                        <button
                          className="mark-completed-button"
                          onClick={() => toggleTaskCompletion(task.key)} // Updated to use key
                        >
                          {task.completed ? "Mark Incomplete" : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                  )) || <div className="task empty"></div>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TaskGrid;
