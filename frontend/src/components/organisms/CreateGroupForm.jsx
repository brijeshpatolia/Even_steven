import { useState } from "react";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { apiCreateGroup } from "../../api/groupApi";




import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [userIds, setUserIds] = useState('');

 
  const queryClient = useQueryClient();

  
  const { mutate, isLoading, error } = useMutation({
    mutationFn: apiCreateGroup,
    onSuccess: () => {

      alert('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      
      setGroupName('');
      setUserIds('');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const usersArray = userIds.split(',').map(id => Number(id.trim()));
    const payload = {
      name: groupName,
      users: usersArray,
    };
    
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Create a New Group</h2>
      {/* the rest of the jsx is the same, but now uses 'isLoading' and 'error' from useMutation */}
      <FormField
        id="group-name"
        label="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        disabled={isLoading}
        required
      />
      <FormField
        id="user-ids"
        label="User IDs (comma-separated)"
        value={userIds}
        onChange={(e) => setUserIds(e.target.value)}
        disabled={isLoading}
        required
      />
      <div className="pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-center text-red-500">{error.detail || 'An error occurred.'}</p>
      )}
    </form>
  );
};