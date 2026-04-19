import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const loadManagers = () => api.get('/admin/managers').then((r) => setManagers(r.data.data)).catch(() => {});
  useEffect(() => { loadManagers().finally(() => setLoading(false)); }, []);

  const remove = async (id, name) => {
    if (!confirm(`Remove manager ${name}? This cannot be undone.`)) return;
    setRemoving(id);
    try {
      await api.delete(`/admin/managers/${id}`);
      toast.success('Manager removed');
      loadManagers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Hostel Managers ({managers.length})</h1>
          <Link to="/admin/managers/create" className="btn-primary">Appoint Manager</Link>
        </div>

        {managers.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No managers yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Manager</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Username</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Hostel</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Mobile</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {managers.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{m.firstName} {m.lastName}</td>
                    <td className="px-4 py-3 text-slate-600">{m.username}</td>
                    <td className="px-4 py-3 text-slate-600">{m.email}</td>
                    <td className="px-4 py-3 text-slate-600">{m.hostel?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.mobileNo}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(m._id, `${m.firstName} ${m.lastName}`)} disabled={removing === m._id} className="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-2 py-1 rounded">
                        {removing === m._id ? '...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
