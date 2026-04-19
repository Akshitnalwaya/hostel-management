import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Spinner /></>;

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hostel Managers', value: stats?.totalManagers, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Hostels', value: stats?.totalHostels, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Rooms', value: stats?.totalRooms, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Allocated Rooms', value: stats?.allocatedRooms, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="card">
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value ?? '—'}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">Admin Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/admin/managers', label: 'Manage Managers', desc: 'View & remove hostel managers' },
            { to: '/admin/managers/create', label: 'Appoint Manager', desc: 'Create a new hostel manager' },
            { to: '/admin/students', label: 'All Students', desc: 'View all registered students' },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="card hover:shadow-md hover:border-brand-100 transition-all">
              <p className="font-semibold text-slate-800">{l.label}</p>
              <p className="text-sm text-slate-500 mt-1">{l.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
