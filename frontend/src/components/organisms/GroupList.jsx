import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiGetGroups } from '../../api/groupApi';

export const GroupList = () => {
    const { data: groups, isLoading, isError, error } = useQuery({
        queryKey: ["groups"],
        queryFn: apiGetGroups,
    });

    if (isLoading) return <p className="text-gray-400">Loading groups...</p>;
    if (isError) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <ul className="space-y-4">
            {groups && groups.length > 0 ? (
                groups.map(group => (
                    <Link to={`/group/${group.name}`} key={group.id} className="block">
                        <li className="bg-gray-700 p-4 rounded-md hover:bg-gray-600 transition-colors">
                            <span className="font-semibold text-lg text-white">
                                {group.name}
                            </span>
                        </li>
                    </Link>
                ))
            ) : (
                <p className="text-gray-500">No groups found. Create one to get started!</p>
            )}
        </ul>
    );
};