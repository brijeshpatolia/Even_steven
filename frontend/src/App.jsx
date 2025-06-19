
import { Routes, Route } from 'react-router-dom';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { HomePage } from './pages/HomePage'; 

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        {/* UPDATED: Route parameter changed to groupId to match page component */}
        <Route path="/group/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;