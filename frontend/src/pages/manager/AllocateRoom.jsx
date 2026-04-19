import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AllocateRoom() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ studentId: '', roomId: '', bedLabel: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/managers/rooms/empty'),
    ]).then(([s, r]) => {
      setStudents(s.data.data.filter((st) => !st.room));
      setRooms(r.data.data.filter((rm) => rm.isUnlocked));
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const availableBeds = form.roomId
    ? (rooms.find((r) => r._id === form.roomId)?.beds || []).filter((b) => !b.isBooked)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/managers/allocate', form);
      toast.success('Room allocated successfully!');
      setForm({ studentId: '', roomId: '', bedLabel: '' });
      // Refresh
      const [s, r] = await Promise.all([api.get('/students'), api.get('/managers/rooms/empty')]);
      setStudents(s.data.data.filter((st) => !st.room));
      setRooms(r.data.data.filter((rm) => rm.isUnlocked));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Allocate Room</h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Student (without room)</label>
              <select className="input-field" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.firstName} {s.lastName} — {s.rollNo?.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Room</label>
              <select className="input-field" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value, bedLabel: '' })} required>
                <option value="">Select room...</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>Floor {r.floor} · Room {r.roomNumber} ({r.beds.filter(b => !b.isBooked).length} beds free)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bed</label>
              <select className="input-field" value={form.bedLabel} onChange={(e) => setForm({ ...form, bedLabel: e.target.value })} required disabled={!form.roomId}>
                <option value="">Select bed...</option>
                {availableBeds.map((b) => <option key={b.bedLabel} value={b.bedLabel}>Bed {b.bedLabel}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Allocating...' : 'Allocate Room'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
