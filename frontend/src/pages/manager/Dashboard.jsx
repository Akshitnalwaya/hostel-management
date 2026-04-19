import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

const StatCard = ({ label, value, color, icon }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ allocated: 0, empty: 0, messages: 0, leave: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/managers/rooms/allocated'),
      api.get('/managers/rooms/empty'),
      api.get('/messages'),
      api.get('/leave'),
      api.get('/applications'),
    ]).then(([a, e, m, l, ap]) => {
      setData({
        allocated: a.data.data.length,
        empty: e.data.data.length,
        messages: m.data.data.filter(x => x.status === 'pending').length,
        leave: l.data.data.filter(x => x.status === 'pending').length,
        applications: ap.data.data.filter(x => x.status === 'pending').length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manager Dashboard</h1>
          <p className="text-slate-500 mt-1">{user?.hostel?.name || 'Hostel'} Management</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Allocated Rooms" value={data.allocated} color="text-blue-600"
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <StatCard label="Empty Rooms" value={data.empty} color="text-emerald-600"
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
          />
          <StatCard label="Pending Complaints" value={data.messages} color="text-amber-600"
            icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
          <StatCard label="Pending Leaves" value={data.leave} color="text-brand-600"
            icon={<svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard label="Pending Applications" value={data.applications} color="text-purple-600"
            icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/manager/applications', label: 'Applications', desc: 'Review hostel applications' },
            { to: '/manager/allocated', label: 'View Allocated Rooms', desc: 'See all occupied rooms' },
            { to: '/manager/empty', label: 'Empty Rooms', desc: 'View and unlock rooms' },
            { to: '/manager/allocate', label: 'Allocate Room', desc: 'Manually assign a student' },
            { to: '/manager/messages', label: 'Complaints', desc: 'View & resolve complaints' },
            { to: '/manager/leave', label: 'Leave Requests', desc: 'Approve or reject leaves' },
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
