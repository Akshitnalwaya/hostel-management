import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const loadApps = () =>
    api.get('/applications').then((r) => setApps(r.data.data)).catch(() => toast.error('Failed to load'));

  useEffect(() => { loadApps().finally(() => setLoading(false)); }, []);

  const decide = async (id, status) => {
    setActing(id + status);
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success(`Application ${status}`);
      loadApps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActing(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  const pending = apps.filter((a) => a.status === 'pending');
  const decided = apps.filter((a) => a.status !== 'pending');

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Hostel Applications
          {pending.length > 0 && (
            <span className="ml-3 text-sm font-medium bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
              {pending.length} pending
            </span>
          )}
        </h1>

        {apps.length === 0 && (
          <div className="card text-center py-12 text-slate-500">No applications yet.</div>
        )}

        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-slate-700 mb-3">Pending ({pending.length})</h2>
            <div className="space-y-4">
              {pending.map((app) => (
                <div key={app._id} className="card border-l-4 border-amber-400">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-600">
                            {app.student?.firstName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {app.student?.firstName} {app.student?.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {app.student?.rollNo?.toUpperCase()} · {app.student?.department} · Year {app.student?.yearOfStudy}
                          </p>
                        </div>
                      </div>

                      <div className="ml-12">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Hostel:</span> {app.hostel?.name} ({app.hostel?.type})
                        </p>
                        {app.message && (
                          <p className="text-sm text-slate-500 mt-1">
                            <span className="font-medium">Message:</span> {app.message}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => decide(app._id, 'approved')}
                        disabled={!!acting}
                        className="btn-success py-1.5 px-4 text-sm"
                      >
                        {acting === app._id + 'approved' ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => decide(app._id, 'rejected')}
                        disabled={!!acting}
                        className="btn-danger py-1.5 px-4 text-sm"
                      >
                        {acting === app._id + 'rejected' ? '...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {decided.length > 0 && (
          <div>
            <h2 className="font-semibold text-slate-700 mb-3">Decided ({decided.length})</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Roll No.</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Hostel</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Applied</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {decided.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {app.student?.firstName} {app.student?.lastName}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {app.student?.rollNo?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{app.hostel?.name}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={app.status === 'approved' ? 'badge-approved' : 'badge-rejected'}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
