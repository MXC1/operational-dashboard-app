import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoxGrid from './components/BoxGrid';
import Navbar from './components/Navbar';
import CompletionLogPage from './pages/CompletionLogPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<BoxGrid />} />
            <Route path="/completion-log" element={<CompletionLogPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
