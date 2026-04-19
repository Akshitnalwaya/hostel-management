import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AllocatedRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vacating, setVacating] = useState(null);

  const loadRooms = () =>
    api.get('/managers/rooms/allocated').then((r) => setRooms(r.data.data)).catch(() => toast.error('Failed to load'));

  useEffect(() => { loadRooms().finally(() => setLoading(false)); }, []);

  const vacateBed = async (roomId, studentId) => {
    setVacating(studentId);
    try {
      await api.post(`/rooms/${roomId}/vacate`, { studentId });
      toast.success('Bed vacated');
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vacate');
    } finally {
      setVacating(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Allocated Rooms ({rooms.length})</h1>
        {rooms.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">No rooms allocated yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room._id} className="card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-800">Floor {room.floor} · Room {room.roomNumber}</h3>
                  <span className={room.isFull ? 'badge-rejected' : 'badge-pending'}>
                    {room.isFull ? 'Full' : 'Partial'}
                  </span>
                </div>
                <div className="space-y-2">
                  {room.beds.filter((b) => b.isBooked).map((bed) => (
                    <div key={bed.bedLabel} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 border border-red-100">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 mr-2">Bed {bed.bedLabel}</span>
                        <span className="text-sm text-slate-800">{bed.student?.firstName} {bed.student?.lastName}</span>
                        <p className="text-xs text-slate-400">{bed.student?.rollNo?.toUpperCase()} · {bed.student?.department}</p>
                      </div>
                      <button
                        onClick={() => vacateBed(room._id, bed.student?._id)}
                        disabled={vacating === bed.student?._id}
                        className="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-2 py-1 rounded"
                      >
                        {vacating === bed.student?._id ? '...' : 'Vacate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
