import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const { data: users, isLoading } = useUsers(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          type="search"
          placeholder="Search by email or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
        />
      </div>

      {isLoading ? (
        <p className="text-text-secondary">Loading users…</p>
      ) : users && users.length > 0 ? (
        <div className="bg-bg-elevated rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-white/10">
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Wallet balance</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'ADMIN' ? 'bg-accent-primary/15 text-accent-primary' : 'bg-white/10 text-text-secondary'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.walletBalance !== null ? `$${u.walletBalance.toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-text-secondary">No users found.</p>
      )}
    </div>
  );
}
