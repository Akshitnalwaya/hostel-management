import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

const QuickLink = ({ to, icon, label, desc, color }) => (
  <Link to={to} className="card hover:shadow-md hover:border-brand-100 transition-all group">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-semibold text-slate-800 mb-1">{label}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </Link>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/profile')
      .then((r) => setProfile(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-brand-100 mt-1">{user?.rollNo?.toUpperCase()} · {profile?.department} · {profile?.yearOfStudy}</p>
          {profile?.hostel ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Allocated: {profile.hostel.name} Hostel · {profile.room ? `Floor ${profile.room.floor}, Room ${profile.room.roomNumber}` : 'Room pending'} · Bed {profile.bed}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              No room allocated yet — book one below
            </div>
          )}
        </div>

        {/* Quick links */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <QuickLink to="/profile" label="My Profile" desc="View your details" color="bg-blue-50"
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <QuickLink to="/services" label="Book Room" desc="Browse & book beds" color="bg-brand-50"
            icon={<svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <QuickLink to="/apply" label="Apply" desc="Hostel application" color="bg-purple-50"
            icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <QuickLink to="/leave" label="Leave Request" desc="Submit leave" color="bg-emerald-50"
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <QuickLink to="/messages" label="Complaints" desc="Submit & track" color="bg-amber-50"
            icon={<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
        </div>
      </main>
    </>
  );
}
