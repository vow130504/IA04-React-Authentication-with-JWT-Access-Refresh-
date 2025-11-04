import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await qc.invalidateQueries(); // clear cached protected data
      navigate('/login', { replace: true });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className={`inline-flex items-center px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 ${className}`}
    >
      {mutation.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
