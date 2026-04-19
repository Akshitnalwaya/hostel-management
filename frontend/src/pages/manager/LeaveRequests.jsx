import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManagerLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [remarks, setRemarks] = useState({});

  const loadLeaves = () => api.get('/leave').then((r) => setLeaves(r.data.data)).catch(() => {});
  useEffect(() => { loadLeaves().finally(() => setLoading(false)); }, []);

  const decide = async (id, status) => {
    setActing(id + status);
    try {
      await api.put(`/leave/${id}`, { status, remarks: remarks[id] || '' });
      toast.success(`Leave ${status}`);
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActing(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  const pending = leaves.filter((l) => l.status === 'pending');
  const decided = leaves.filter((l) => l.status !== 'pending');

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Leave Requests</h1>

        {pending.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-slate-700 mb-3">Pending ({pending.length})</h2>
            <div className="space-y-4">
              {pending.map((leave) => (
                <div key={leave._id} className="card border-l-4 border-brand-400">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{leave.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{leave.body}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {leave.student?.firstName} {leave.student?.lastName} ({leave.student?.rollNo?.toUpperCase()}) · {leave.student?.department} · {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                      <input
                        type="text"
                        placeholder="Remarks (optional)"
                        className="input-field mt-3 text-xs py-1.5"
                        value={remarks[leave._id] || ''}
                        onChange={(e) => setRemarks({ ...remarks, [leave._id]: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => decide(leave._id, 'approved')} disabled={!!acting} className="btn-success py-1.5 px-3 text-sm">
                        {acting === leave._id + 'approved' ? '...' : 'Approve'}
                      </button>
                      <button onClick={() => decide(leave._id, 'rejected')} disabled={!!acting} className="btn-danger py-1.5 px-3 text-sm">
                        {acting === leave._id + 'rejected' ? '...' : 'Reject'}
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
            <div className="space-y-3">
              {decided.map((leave) => (
                <div key={leave._id} className="card opacity-80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{leave.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {leave.student?.firstName} {leave.student?.lastName} · {new Date(leave.decidedAt).toLocaleDateString()}
                      </p>
                      {leave.remarks && <p className="text-xs text-slate-500 mt-0.5">Remarks: {leave.remarks}</p>}
                    </div>
                    <span className={leave.status === 'approved' ? 'badge-approved' : 'badge-rejected'}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {leaves.length === 0 && (
          <div className="card text-center py-12 text-slate-500">No leave requests yet.</div>
        )}
      </main>
    </>
  );
}
