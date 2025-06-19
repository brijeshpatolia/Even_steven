
import { useQuery } from '@tanstack/react-query';
import { apiGetGroupBalances } from '../../api/balancesApi';


export const GroupBalanceDisplay = ({ groupName }) => {
  
  const { data: balances, error, isLoading } = useQuery({
    queryKey: ['balances', groupName],
    queryFn: () => apiGetGroupBalances(groupName),
  });

  if (isLoading) return <p className="text-center text-gray-400">Calculating balances...</p>;
  if (error) return <p className="text-center text-red-500">Could not load balances.</p>;

  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Group Balances</h2>
      {balances.length === 0 ? (
        <p className="text-center text-gray-500">All settled up!</p>
      ) : (
        <ul className="space-y-3">
          {balances.map((balance, index) => (
            <li key={index} className="p-4 bg-gray-700 rounded-md text-white font-semibold shadow-md text-center">
              User <span className="text-orange-400">{balance.ower_id}</span> owes User <span className="text-green-400">{balance.owee_id}</span>
              <span className="block text-xl">${balance.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};