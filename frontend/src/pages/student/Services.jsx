import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/ui/Spinner';
import api from '../../api/axios';

function NotAppliedGate() {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Application Required</h2>
      <p className="text-slate-500 mb-1">
        You haven't submitted a hostel application yet.
      </p>
      <p className="text-slate-400 text-sm mb-8">
        Before booking a room, you need to apply for hostel accommodation. Once your application is approved by the manager, you'll be able to select and book a room.
      </p>
      <Link
        to="/apply"
        className="btn-primary inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Submit Application Now
      </Link>
    </div>
  );
}

function PendingGate({ application }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01" />
          </svg>
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">Application Under Review</h2>
      <p className="text-slate-500 mb-6">
        Your application has been submitted and is currently being reviewed by the hostel manager. Room booking will be unlocked once your application is approved.
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Applied to</span>
          <span className="font-semibold text-slate-800">{application?.hostel?.name} Hostel</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Submitted on</span>
          <span className="font-semibold text-slate-800">
            {new Date(application?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="badge-pending">Pending Approval</span>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Please check back later or contact your hostel manager if you haven't heard back in a while.
      </p>
    </div>
  );
}

function RejectedGate() {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Application Not Approved</h2>
      <p className="text-slate-500 mb-8">
        Your previous application was not approved by the manager. You can submit a new application with updated details.
      </p>
      <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Re-apply Now
      </Link>
    </div>
  );
}

export default function Services() {
  const [status, setStatus] = useState(null); // 'loading' | 'none' | 'pending' | 'rejected' | 'approved'
  const [application, setApplication] = useState(null);

  useEffect(() => {
    setStatus('loading');
    api.get('/applications/my')
      .then((r) => {
        const apps = r.data.data;
        if (!apps.length) { setStatus('none'); return; }

        // Pick the most relevant application: approved > pending > rejected
        const approved = apps.find((a) => a.status === 'approved');
        if (approved) { setStatus('approved'); setApplication(approved); return; }

        const pending = apps.find((a) => a.status === 'pending');
        if (pending) { setStatus('pending'); setApplication(pending); return; }

        setStatus('rejected');
      })
      .catch(() => setStatus('none'));
  }, []);

  if (status === 'loading') return <><Navbar /><Spinner /></>;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Gates */}
        {status === 'none' && <NotAppliedGate />}
        {status === 'pending' && <PendingGate application={application} />}
        {status === 'rejected' && <RejectedGate />}

        {/* Actual booking UI — only shown when approved */}
        {status === 'approved' && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Select Hostel Type</h1>
              <span className="badge-approved">Application Approved</span>
            </div>
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
          </>
        )}
      </main>
    </>
  );
}
