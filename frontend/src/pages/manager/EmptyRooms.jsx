import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function EmptyRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(null);

  const loadRooms = () =>
    api.get('/managers/rooms/empty').then((r) => setRooms(r.data.data)).catch(() => toast.error('Failed to load'));

  useEffect(() => { loadRooms().finally(() => setLoading(false)); }, []);

  const unlock = async (roomId) => {
    setUnlocking(roomId);
    try {
      await api.post('/managers/rooms/unlock', { roomId });
      toast.success('Room unlocked for booking');
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unlock');
    } finally {
      setUnlocking(null);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Empty Rooms ({rooms.length})</h1>
        {rooms.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">All rooms are allocated.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Floor</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Room No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Available Beds</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">{room.floor}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{room.roomNumber}</td>
                    <td className="px-4 py-3 text-slate-600">{room.beds.filter((b) => !b.isBooked).length} / {room.totalBeds}</td>
                    <td className="px-4 py-3">
                      <span className={room.isUnlocked ? 'badge-approved' : 'bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full font-medium'}>
                        {room.isUnlocked ? 'Open for booking' : 'Locked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!room.isUnlocked && (
                        <button onClick={() => unlock(room._id)} disabled={unlocking === room._id} className="btn-secondary py-1 px-3 text-xs">
                          {unlocking === room._id ? 'Unlocking...' : 'Unlock'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
