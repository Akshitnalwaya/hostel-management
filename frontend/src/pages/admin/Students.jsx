import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/students').then((r) => setStudents(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    s.rollNo?.includes(search.toLowerCase()) ||
    s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">All Students ({students.length})</h1>
          <input
            type="text"
            placeholder="Search by name, roll no, dept..."
            className="input-field w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Roll No.</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Dept</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Hostel</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{s.rollNo?.toUpperCase()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-slate-600">{s.department}</td>
                  <td className="px-4 py-3 text-slate-600">{s.yearOfStudy}</td>
                  <td className="px-4 py-3 text-slate-600">{s.mobileNo}</td>
                  <td className="px-4 py-3 text-slate-600">{s.hostel?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{s.room ? `F${s.room.floor}-R${s.room.roomNumber}` : '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
