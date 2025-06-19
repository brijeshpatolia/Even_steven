// src/pages/GroupDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { AddExpenseForm } from '../components/organisms/AddExpenseForm';
import { GroupBalanceDisplay } from '../components/organisms/GroupBalanceDisplay';


export const GroupDetailPage = () => {
  const { groupName } = useParams();

  return (
    <div className="p-8">
      <Link to="/" className="text-green-400 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-gray-500">Group:</span> <span className="text-green-400">{groupName}</span>
        </h1>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <AddExpenseForm groupName={groupName} />
        </div>
        <div className="flex justify-center">
          <GroupBalanceDisplay groupName={groupName} />
        </div>
      </main>
    </div>
  );
};