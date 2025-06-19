import { useState } from "react";
import { apiGetUserBalances } from "../../api/usersApi";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

export const UserBalanceChecker = () => {
  const [userId, setUserId] = useState('');
  const [balanceData, setBalanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckBalance = async () => {
    setIsLoading(true);
    setError(null);
    setBalanceData(null);

    try {
      const data = await apiGetUserBalances(userId);
      setBalanceData(data);
    } catch (err) {
      setError(err.detail || 'Failed to fetch balance. Please check the User ID.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Check User Balance</h2>

      <div className="flex items-center gap-4">
        <Input
          id="user-id-check"
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex-shrink-0 w-32">
          <Button onClick={handleCheckBalance} disabled={isLoading || !userId}>
            {isLoading ? 'Checking...' : 'Check'}
          </Button>
        </div>
      </div>

      
      <div className="pt-4 min-h-[100px]">
        {error && (
          <p className="text-sm text-center text-red-500">{error}</p>
        )}
        {balanceData && (
          <div className="p-4 bg-gray-700 rounded-md space-y-2">
            <h3 className="text-lg font-semibold text-white">Balance Summary for User {userId}</h3>
            <p className="text-gray-300">Total You Are Owed: <span className="font-bold text-green-400">${balanceData.total_you_are_owed.toFixed(2)}</span></p>
            <p className="text-gray-300">Total You Owe: <span className="font-bold text-orange-400">${balanceData.total_you_owe.toFixed(2)}</span></p>
            <hr className="border-gray-600"/>
            <p className="text-gray-200 font-bold">Net Balance: <span className={balanceData.net_balance >= 0 ? 'text-green-400' : 'text-red-500'}>${balanceData.net_balance.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};