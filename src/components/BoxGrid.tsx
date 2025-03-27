import React from 'react';
import './BoxGrid.css';

export interface Box { // Export the Box interface
  id: string; // Unique identifier for each task
  title: string;
  subtitle: string;
  category: string;
  date: string; // ISO format date string
  completed: boolean; // New field to indicate completion
}

const getBoxColor = (date: string, completed: boolean): string => {
  const today = new Date();
  const boxDate = new Date(date);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (boxDate > today && boxDate <= endOfWeek) {
    return 'amber'; // Due soon (not clickable)
  } else if (boxDate.toDateString() === today.toDateString() && !completed) {
    return 'amber'; // Due today (clickable)
  } else if (boxDate < today && !completed) {
    return 'red'; // Overdue (clickable)
  } else if (completed) {
    return 'green'; // Completed
  }
  return '';
};

const isClickable = (date: string): boolean => {
  const today = new Date();
  const boxDate = new Date(date);
  return boxDate.toDateString() === today.toDateString() || boxDate < today; // Clickable if due today or overdue
};

interface BoxGridProps {
  boxState: Box[];
  setBoxState: React.Dispatch<React.SetStateAction<Box[]>>;
  completedTasks: Box[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<Box[]>>;
}

const BoxGrid: React.FC<BoxGridProps> = ({ boxState, setBoxState, setCompletedTasks }) => {
  const toggleCompleted = (category: string, index: number) => {
    console.log(`Toggling completion for category: ${category}, index: ${index}`);
    setBoxState((prevState) =>
      prevState.map((box) => {
        const isTargetBox = box.category === category && prevState.filter(b => b.category === category).indexOf(box) === index;
        if (isTargetBox) {
          const updatedBox = { ...box, completed: !box.completed };
          console.log(`Updated box:`, updatedBox);
          setCompletedTasks((prevCompleted) =>
            updatedBox.completed
              ? [...prevCompleted, updatedBox]
              : prevCompleted.filter((task) => task.id !== updatedBox.id)
          );
          return updatedBox;
        }
        return box;
      })
    );
  };

  const groupedBoxes = boxState.reduce((acc, box) => {
    if (!acc[box.category]) {
      acc[box.category] = [];
    }
    acc[box.category].push(box);
    return acc;
  }, {} as Record<string, Box[]>);

  return (
    <div className="box-grid-container">
      <div className="box-grid">
        {Object.entries(groupedBoxes).map(([category, boxes]) => (
          <div key={category} className="category-column">
            <h2>{category}</h2>
            {boxes.map((box, index) => (
              <div
                key={index}
                className={`box ${getBoxColor(box.date, box.completed)} ${!isClickable(box.date) ? 'non-clickable' : ''}`}
                onClick={isClickable(box.date) ? () => {
                  console.log(`Box clicked:`, box);
                  toggleCompleted(category, index);
                } : undefined}
              >
                <h3>{box.title}</h3>
                <p>{box.subtitle}</p>
                <p className="box-date">{box.date}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxGrid;
