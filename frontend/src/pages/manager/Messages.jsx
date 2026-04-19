import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManagerMessages() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const loadMsgs = () => api.get('/messages').then((r) => setMsgs(r.data.data)).catch(() => {});
  useEffect(() => { loadMsgs().finally(() => setLoading(false)); }, []);

  const resolve = async (id) => {
    setResolving(id);
    try {
      await api.put(`/messages/${id}/resolve`);
      toast.success('Complaint resolved');
      loadMsgs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setResolving(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  const pending = msgs.filter((m) => m.status === 'pending');
  const resolved = msgs.filter((m) => m.status === 'resolved');

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Complaints / Messages</h1>

        {pending.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-slate-700 mb-3">Pending ({pending.length})</h2>
            <div className="space-y-3">
              {pending.map((msg) => (
                <div key={msg._id} className="card border-l-4 border-amber-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{msg.subject}</p>
                      <p className="text-sm text-slate-500 mt-1">{msg.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        From: {msg.sender?.firstName} {msg.sender?.lastName} ({msg.sender?.rollNo?.toUpperCase()}) · {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => resolve(msg._id)} disabled={resolving === msg._id} className="btn-success ml-4 py-1.5 px-3 text-sm whitespace-nowrap">
                      {resolving === msg._id ? '...' : 'Resolve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resolved.length > 0 && (
          <div>
            <h2 className="font-semibold text-slate-700 mb-3">Resolved ({resolved.length})</h2>
            <div className="space-y-3">
              {resolved.map((msg) => (
                <div key={msg._id} className="card opacity-75">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-700">{msg.subject}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{msg.message}</p>
                      <p className="text-xs text-slate-400 mt-1">Resolved on {new Date(msg.resolvedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="badge-resolved ml-4">Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {msgs.length === 0 && (
          <div className="card text-center py-12 text-slate-500">No complaints yet.</div>
        )}
      </main>
    </>
  );
}
