import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function LeaveRequest() {
  const [myLeaves, setMyLeaves] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadLeaves = () =>
    api.get('/leave/my').then((r) => setMyLeaves(r.data.data)).catch(() => {});

  useEffect(() => {
    loadLeaves().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leave', form);
      toast.success('Leave request submitted!');
      setForm({ title: '', body: '' });
      loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Leave Requests</h1>

        <div className="card mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Submit Leave Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input type="text" className="input-field" placeholder="e.g. Home visit — Diwali festival" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Details</label>
              <textarea className="input-field h-28 resize-none" placeholder="Describe the reason for your leave, dates, etc." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">My Leave History</h2>
          {myLeaves.length === 0 ? (
            <p className="text-slate-500 text-sm">No leave requests yet.</p>
          ) : (
            <div className="space-y-3">
              {myLeaves.map((leave) => (
                <div key={leave._id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{leave.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{leave.body}</p>
                    </div>
                    <span className={leave.status === 'approved' ? 'badge-approved' : leave.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>
                      {leave.status}
                    </span>
                  </div>
                  {leave.remarks && <p className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2">Remarks: {leave.remarks}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(leave.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
