// src/components/organisms/AddExpenseForm.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExpense } from '../../api/expensesApi'; // Assuming this is the correct API function
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';

// CORRECTED: The component now accepts 'groupId' (a number) as a prop instead of 'groupName'
export const AddExpenseForm = ({ groupId }) => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [splits, setSplits] = useState(''); // for percentage splits, e.g., "101:60, 104:40"

  const { mutate, isLoading, error } = useMutation({
    mutationFn: addExpense, // This function should handle the API call
    onSuccess: () => {
      alert('Expense added successfully!');
      
      // CORRECTED: Use the numerical groupId for query invalidation for better reliability
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
      
      // Clear form
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplits('');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let splitsPayload = {};
    if (splitType === 'percentage' && splits) {
      splits.split(',').forEach(part => {
        const [key, value] = part.split(':');
        splitsPayload[key.trim()] = Number(value.trim());
      });
    }

    // CORRECTED: Pass the 'groupId' and expenseData to the mutation
    mutate({
      groupId,
      expenseData: {
        description,
        amount: Number(amount),
        paid_by_user_id: Number(paidBy),
        split_type: splitType,
        splits: splitsPayload,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Add New Expense</h2>
      <FormField id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
      <FormField id="amount" label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={isLoading} />
      <FormField id="paidBy" label="Paid by User ID" type="number" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required disabled={isLoading} />

      <div>
        <label htmlFor="splitType" className="block mb-2 text-sm font-medium text-gray-400">Split Type</label>
        <select id="splitType" value={splitType} onChange={(e) => setSplitType(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="equal">Equal</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      {splitType === 'percentage' && (
        <FormField id="splits" label="Percentage Splits" placeholder="e.g., 101:60, 104:40" value={splits} onChange={(e) => setSplits(e.target.value)} required={splitType === 'percentage'} disabled={isLoading} />
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Expense'}
        </Button>
      </div>
      {error && <p className="text-sm text-center text-red-500">{error.message || 'An error occurred.'}</p>}
    </form>
  );
};