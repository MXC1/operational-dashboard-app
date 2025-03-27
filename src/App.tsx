import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoxGrid, { Box } from './components/BoxGrid';
import Navbar from './components/Navbar';
import CompletionLogPage from './pages/CompletionLogPage';
import { useEffect, useState } from 'react';

function App() {
  console.log('App component rendered'); // Debugging render behavior.

  const [completedTasks, setCompletedTasks] = useState<Box[]>([]);
  const [boxState, setBoxState] = useState<Box[]>([
    { id: '1', title: 'Task 1', subtitle: 'Subtitle 1', category: 'Monitoring and \nIncident Management', date: '2025-03-17', completed: false },
    { id: '2', title: 'Task 2', subtitle: 'Subtitle 2', category: 'Monitoring and \nIncident Management', date: '2025-03-27', completed: true },
    { id: '3', title: 'Task 3', subtitle: 'Subtitle 3', category: 'Release Management', date: '2025-03-29', completed: false },
    { id: '4', title: 'Task 4', subtitle: 'Subtitle 4', category: 'Release Management', date: '2025-04-01', completed: true },
    { id: '5', title: 'Task 5', subtitle: 'Subtitle 5', category: 'NBO Operations', date: '2025-02-27', completed: false },
  ]);

  useEffect(() => {
    console.log('useEffect triggered');
    // console.log(`Completed tasks state initialized:`, completedTasks);
  }, []); // Empty dependency array ensures this runs only once after the initial render.

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<BoxGrid 
                boxState={boxState} 
                setBoxState={setBoxState} 
                completedTasks={completedTasks} 
                setCompletedTasks={(tasks) => {
                  console.log(`Updating completed tasks:`, tasks);
                  setCompletedTasks(tasks);
                }} 
              />}
            />
            <Route path="/completion-log" element={<CompletionLogPage completedTasks={completedTasks} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
