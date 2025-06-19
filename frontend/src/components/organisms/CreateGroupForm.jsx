import { useState } from "react";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { apiCreateGroup } from "../../api/groupApi";



/**
 * an organism that provides a full form for creating a new group.
 * it manages its own state and delegates the api call.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [userIds, setUserIds] = useState('');

  // 2. get an instance of the query client
  const queryClient = useQueryClient();

  // 3. set up the mutation
  const { mutate, isLoading, error } = useMutation({
    mutationFn: apiCreateGroup, // the function to call for the mutation
    onSuccess: () => {
      // this is the magic part!
      // it tells tanstack query that the 'groups' query is now out-of-date
      // and needs to be refetched automatically.
      alert('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      // clear the form
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
    // 4. call the 'mutate' function to trigger the api call
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