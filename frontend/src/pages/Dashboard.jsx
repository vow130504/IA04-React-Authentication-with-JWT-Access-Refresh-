import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { api } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/me');
      return data;
    },
    staleTime: 1000 * 30,
  });

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Error: {error?.message || 'Failed to load'}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <p className="text-gray-600">You are logged in.</p>
        <pre className="bg-gray-50 p-3 rounded overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
