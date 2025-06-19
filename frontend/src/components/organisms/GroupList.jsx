import { useState, useEffect } from 'react';
import { apiGetGroups } from '../../api/groupApi';
import { Link } from 'react-router-dom';



export const GroupList = () => {
  
  const [groups, setGroups] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        
        setIsLoading(true);
        setError(null);
        const data = await apiGetGroups();
        setGroups(data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Failed to load groups.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []); 

 
  if (isLoading) {
    return <p className="text-center text-gray-400">Loading groups...</p>;
  }


  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Existing Groups</h2>
      {/* ... */}
      <ul className="space-y-3">
        {groups.map(group => (
          // make each list item a link to the group's detail page
          <Link to={`/group/${group.name}`} key={group.id} className="block"> 
            <li className="p-4 bg-gray-700 rounded-md text-white font-semibold shadow-md hover:bg-gray-600 transition-colors duration-200">
              {group.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};