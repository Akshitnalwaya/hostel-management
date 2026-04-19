import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function StudentMessages() {
  const [myMsgs, setMyMsgs] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadMsgs = () => api.get('/messages/my').then((r) => setMyMsgs(r.data.data)).catch(() => {});

  useEffect(() => { loadMsgs().finally(() => setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/messages', form);
      toast.success('Complaint submitted!');
      setForm({ subject: '', message: '' });
      loadMsgs();
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
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Complaints / Messages</h1>

        <div className="card mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Submit Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input type="text" className="input-field" placeholder="e.g. Water supply issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea className="input-field h-28 resize-none" placeholder="Describe your issue in detail..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">My Complaints</h2>
          {myMsgs.length === 0 ? (
            <p className="text-slate-500 text-sm">No complaints submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {myMsgs.map((msg) => (
                <div key={msg._id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{msg.subject}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{msg.message}</p>
                    </div>
                    <span className={msg.status === 'resolved' ? 'badge-resolved' : 'badge-pending'}>{msg.status}</span>
                  </div>
                  {msg.resolvedAt && <p className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2">Resolved on {new Date(msg.resolvedAt).toLocaleDateString()}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
