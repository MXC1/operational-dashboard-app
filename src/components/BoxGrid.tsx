import React, { useState } from 'react';
import './BoxGrid.css';

interface Box {
  title: string;
  subtitle: string;
  category: string;
  date: string; // ISO format date string
  completed: boolean; // New field to indicate completion
}

const boxes: Box[] = [
  { title: 'Task 1', subtitle: 'Subtitle 1', category: 'Monitoring and \nIncident Management', date: '2025-03-17', completed: false },
  { title: 'Task 2', subtitle: 'Subtitle 2', category: 'Monitoring and \nIncident Management', date: '2025-03-27', completed: true },
  { title: 'Task 3', subtitle: 'Subtitle 3', category: 'Release Management', date: '2025-03-29', completed: false },
  { title: 'Task 4', subtitle: 'Subtitle 4', category: 'Release Management', date: '2025-04-01', completed: true },
  { title: 'Task 5', subtitle: 'Subtitle 5', category: 'NBO Operations', date: '2025-02-27', completed: false },
];

const getBoxColor = (date: string, completed: boolean): string => {
  const today = new Date();
  const boxDate = new Date(date);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const lastWeekEnd = new Date(startOfWeek);
  lastWeekEnd.setDate(startOfWeek.getDate() - 1);

  if (boxDate > endOfWeek) {
    return 'white'; // Not due
  } else if (boxDate >= startOfWeek && boxDate <= endOfWeek && !completed) {
    return 'amber'; // Due
  } else if (boxDate <= lastWeekEnd && !completed) {
    return 'red'; // Overdue
  } else if (boxDate <= endOfWeek && completed) {
    return 'green'; // Completed
  }
  return '';
};

const BoxGrid: React.FC = () => {
  const [boxState, setBoxState] = useState<Box[]>(boxes);

  const toggleCompleted = (category: string, index: number) => {
    setBoxState((prevState) =>
      prevState.map((box) =>
        box.category === category && prevState.filter(b => b.category === category).indexOf(box) === index
          ? { ...box, completed: !box.completed }
          : box
      )
    );
  };

  const isClickable = (date: string): boolean => {
    const today = new Date();
    const boxDate = new Date(date);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return boxDate <= endOfWeek; // Only allow clicking for tasks due this week or earlier
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
                onClick={isClickable(box.date) ? () => toggleCompleted(category, index) : undefined}
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
