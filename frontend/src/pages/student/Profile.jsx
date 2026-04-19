import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

const Field = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</dd>
  </div>
);

export default function Profile() {
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-600">{profile?.firstName?.[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{profile?.firstName} {profile?.lastName}</h2>
              <p className="text-slate-500 text-sm">{profile?.rollNo?.toUpperCase()}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Field label="Department" value={profile?.department} />
            <Field label="Year of Study" value={profile?.yearOfStudy} />
            <Field label="Mobile" value={profile?.mobileNo} />
          </dl>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Room Allocation</h3>
          {profile?.hostel ? (
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Field label="Hostel" value={profile.hostel?.name} />
              <Field label="Type" value={profile.hostel?.type} />
              <Field label="Floor" value={profile.room?.floor} />
              <Field label="Room No." value={profile.room?.roomNumber} />
              <Field label="Bed" value={profile.bed} />
              <Field label="Fee/Year" value={profile.hostel?.feePerYear ? `₹${profile.hostel.feePerYear.toLocaleString()}` : null} />
            </dl>
          ) : (
            <p className="text-slate-500 text-sm">No room allocated yet. Visit <strong>Book Room</strong> to book a bed.</p>
          )}
        </div>
      </main>
    </>
  );
}
