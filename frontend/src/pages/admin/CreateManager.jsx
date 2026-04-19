import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CreateManager() {
  const [hostels, setHostels] = useState([]);
  const [form, setForm] = useState({ username: '', firstName: '', lastName: '', mobileNo: '', email: '', hostelName: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/hostels').then((r) => setHostels(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/managers', form);
      toast.success('Manager created successfully!');
      setForm({ username: '', firstName: '', lastName: '', mobileNo: '', email: '', hostelName: '', password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create manager');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/managers" className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Appoint Manager</h1>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input type="text" className="input-field" placeholder="manager_username" value={form.username} onChange={set('username')} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input type="text" className="input-field" placeholder="John" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input type="text" className="input-field" placeholder="Doe" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile</label>
              <input type="tel" className="input-field" placeholder="9876543210" value={form.mobileNo} onChange={set('mobileNo')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="manager@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Hostel</label>
              <select className="input-field" value={form.hostelName} onChange={set('hostelName')} required>
                <option value="">Select hostel...</option>
                {hostels.map((h) => <option key={h._id} value={h.name}>{h.name} ({h.type})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input type="password" className="input-field" value={form.password} onChange={set('password')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm</label>
                <input type="password" className="input-field" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating...' : 'Appoint Manager'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
