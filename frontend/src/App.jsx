// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { HomePage } from './pages/HomePage'; // Import HomePage as a named export


function App() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/group/:groupName" element={<GroupDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;