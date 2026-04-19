import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SelectFloor() {
  const [params] = useSearchParams();
  const type = params.get('type') || 'non-attached';
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [selected, setSelected] = useState('');
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/hostels/type/${type}`)
      .then((r) => { setHostels(r.data.data); if (r.data.data.length) setSelected(r.data.data[0]._id); })
      .catch(() => toast.error('Failed to load hostels'))
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    const h = hostels.find((x) => x._id === selected);
    if (h) setFloors(Array.from({ length: h.floors }, (_, i) => i + 1));
  }, [selected, hostels]);

  if (loading) return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/services" className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Select Floor</h1>
          <span className="badge-approved capitalize">{type}</span>
        </div>

        {hostels.length > 1 && (
          <div className="card mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Hostel Block</label>
            <select className="input-field" value={selected} onChange={(e) => setSelected(e.target.value)}>
              {hostels.map((h) => <option key={h._id} value={h._id}>{h.name}</option>)}
            </select>
          </div>
        )}

        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Choose a Floor</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => navigate(`/room?hostelId=${selected}&type=${type}&floor=${floor}`)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-all group"
              >
                <span className="text-2xl font-bold text-slate-700 group-hover:text-brand-600">{floor}</span>
                <span className="text-xs text-slate-400 mt-1">Floor</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
