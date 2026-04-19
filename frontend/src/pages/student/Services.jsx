import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Select Hostel Type</h1>
        <p className="text-slate-500 mb-8">Choose the type of hostel accommodation you prefer</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/select-floor?type=attached" className="card hover:shadow-lg hover:border-brand-200 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Attached Hostel</h2>
            <p className="text-slate-500 text-sm mb-4">Private attached bathroom with each room. Premium facilities included.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-brand-600">₹75,000</span>
              <span className="text-slate-400 text-sm">/ year</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Private attached bathroom</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 3 students per room</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Study table & wardrobe</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Wi-Fi included</li>
            </ul>
            <div className="mt-5 btn-primary text-center">Choose Attached</div>
          </Link>

          <Link to="/select-floor?type=non-attached" className="card hover:shadow-lg hover:border-slate-300 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-slate-200 transition-colors">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Non-Attached Hostel</h2>
            <p className="text-slate-500 text-sm mb-4">Shared common bathrooms on each floor. Affordable and social.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-700">₹65,000</span>
              <span className="text-slate-400 text-sm">/ year</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Shared bathrooms per floor</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 3 students per room</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Study table & wardrobe</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Wi-Fi included</li>
            </ul>
            <div className="mt-5 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 px-5 rounded-lg text-center transition-colors">
              Choose Non-Attached
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
