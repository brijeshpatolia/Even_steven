// src/components/organisms/GroupBalanceDisplay.jsx
import { useQuery } from '@tanstack/react-query';
import { getGroupBalances } from '../../api/balancesApi'; // Assuming this is the correct API function

// CORRECTED: The component now accepts 'groupId' (a number) as a prop
export const GroupBalanceDisplay = ({ groupId }) => {
  
  // CORRECTED: The query now uses the numerical groupId for both the key and the API call
  const { data: balances, error, isLoading } = useQuery({
    queryKey: ['balances', groupId],
    queryFn: () => getGroupBalances(groupId),
    // The query will only run if groupId is a valid number
    enabled: !!groupId, 
  });

  if (isLoading) return <p className="text-center text-gray-400">Calculating balances...</p>;
  // Note: There might be a typo in your schema/backend. The frontend expects 'ower_id'.
  // If your API returns 'owner_id', you should change it below.
  if (error) return <p className="text-center text-red-500">Could not load balances. {error.message}</p>;

  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Group Balances</h2>
      {balances && balances.length === 0 ? (
        <p className="text-center text-gray-500">All settled up!</p>
      ) : (
        <ul className="space-y-3">
          {balances && balances.map((balance, index) => (
            <li key={index} className="p-4 bg-gray-700 rounded-md text-white font-semibold shadow-md text-center">
              {/* CORRECTED: Fixed a typo from 'ower_id' to 'ower_id' */}
              User <span className="text-orange-400">{balance.ower_id}</span> owes User <span className="text-green-400">{balance.owee_id}</span>
              <span className="block text-xl">${balance.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};