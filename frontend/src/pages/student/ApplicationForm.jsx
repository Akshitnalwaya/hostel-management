import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function ApplicationForm() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [form, setForm] = useState({ hostelId: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/hostels'), api.get('/applications/my')])
      .then(([h, a]) => { setHostels(h.data.data); setMyApps(a.data.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/applications', form);
      toast.success('Application submitted!');
      const a = await api.get('/applications/my');
      setMyApps(a.data.data);
      setForm({ hostelId: '', message: '' });
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
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Hostel Application</h1>

        <div className="card mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Submit Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Applicant</label>
              <div className="input-field bg-slate-50 text-slate-500 cursor-not-allowed">{user?.firstName} {user?.lastName} — {user?.rollNo?.toUpperCase()}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Hostel</label>
              <select className="input-field" value={form.hostelId} onChange={(e) => setForm({ ...form, hostelId: e.target.value })} required>
                <option value="">Select hostel...</option>
                {hostels.map((h) => <option key={h._id} value={h._id}>{h.name} ({h.type})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason / Special Requests</label>
              <textarea className="input-field h-24 resize-none" placeholder="Describe your reason for applying or any special requests..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        {myApps.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-slate-800 mb-4">My Applications</h2>
            <div className="space-y-3">
              {myApps.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{app.hostel?.name}</p>
                    <p className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={app.status === 'approved' ? 'badge-approved' : app.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
