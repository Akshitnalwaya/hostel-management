import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function RoomView() {
  const [params] = useSearchParams();
  const hostelId = params.get('hostelId');
  const floor = params.get('floor');
  const type = params.get('type');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [parentEmail, setParentEmail] = useState('');
  const [booking, setBooking] = useState(false);

  const loadRooms = () => {
    api.get(`/hostels/${hostelId}/floors/${floor}/rooms`)
      .then((r) => setRooms(r.data.data))
      .catch(() => toast.error('Failed to load rooms'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRooms(); }, [hostelId, floor]);

  const bookBed = async (roomId, bedLabel) => {
    setBooking(true);
    try {
      await api.post(`/rooms/${roomId}/book`, { bedLabel, parentEmail: parentEmail || undefined });
      toast.success(`Bed ${bedLabel} booked successfully!`);
      setBookingRoom(null);
      setParentEmail('');
      loadRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/select-floor?type=${type}`} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Floor {floor} — Rooms</h1>
          <span className="badge-approved capitalize">{type}</span>
        </div>

        {rooms.every((r) => !r.isUnlocked) && (
          <div className="card border border-amber-200 bg-amber-50 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            <div>
              <p className="font-semibold text-amber-800">No rooms available on this floor</p>
              <p className="text-sm text-amber-700 mt-0.5">Rooms open floor by floor as they fill up. Please go back and select <strong>Floor 1</strong> to start booking.</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className={`card ${!room.isUnlocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Room {room.roomNumber}</h3>
                <span className={room.isFull ? 'badge-rejected' : room.isUnlocked ? 'badge-approved' : 'bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full font-medium'}>
                  {room.isFull ? 'Full' : room.isUnlocked ? 'Available' : 'Locked'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {room.beds.map((bed) => (
                  <div key={bed.bedLabel} className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${bed.isBooked ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                    <span className="font-medium text-slate-700">Bed {bed.bedLabel}</span>
                    {bed.isBooked ? (
                      <span className="text-xs text-red-600 font-medium">Booked</span>
                    ) : room.isUnlocked ? (
                      <button
                        onClick={() => setBookingRoom({ roomId: room._id, bedLabel: bed.bedLabel })}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded"
                      >
                        Book
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Booking confirmation modal */}
        {bookingRoom && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-semibold text-slate-800 mb-1">Confirm Booking</h3>
              <p className="text-sm text-slate-500 mb-4">Bed {bookingRoom.bedLabel} — Room {rooms.find(r => r._id === bookingRoom.roomId)?.roomNumber}</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent email (optional)</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">Notification will be sent on successful booking</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setBookingRoom(null); setParentEmail(''); }} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => bookBed(bookingRoom.roomId, bookingRoom.bedLabel)} disabled={booking} className="btn-primary flex-1">
                  {booking ? 'Booking...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
