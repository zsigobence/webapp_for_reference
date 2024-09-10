import './App.css';
import {
  HashRouter as Router,
  Routes, 
  Route
} from 'react-router-dom';
import HomePage from './Homepage';
import TaskManager from './TaskManager';
import Visitor from './Visitor';

function App() {
  return (
    <Router>
    <Routes> 
        <Route
          path="/Homepage"
          element={<HomePage />} 
        />
        <Route
          path="/"
          element={<HomePage />} 
        />
        <Route
          path="/TaskManager"
          element={<TaskManager />} 
        />
        <Route
          path="/Visitor"
          element={<Visitor />} 
        />
      </Routes>
      </Router>
  );
}

export default App;
