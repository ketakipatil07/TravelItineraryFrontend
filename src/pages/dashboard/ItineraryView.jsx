import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itineraries } from '../../api/axios';
import { Clock, MapPin, Users, Trophy, Lightbulb, Share2, Trash2, Copy, Check } from 'lucide-react';

export default function ItineraryView() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadItinerary(); }, [id]);

  const loadItinerary = async () => {
    try { setLoading(true); const res = await itineraries.getById(id); setItinerary(res.data.itinerary); }
    catch (e) { setError(e.response?.data?.message || 'Failed to load'); }
    finally { setLoading(false); }
  };

  const handleShare = async () => {
    try { const res = await itineraries.share(id); setShareLink(`${window.location.origin}/shared/${res.data.shareCode}`); }
    catch (e) { setError(e.response?.data?.message || 'Share failed'); }
  };

  const handleCopy = async () => { await navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleDelete = async () => {
    if (!window.confirm('Delete this itinerary?')) return;
    try { await itineraries.remove(id); navigate('/history'); }
    catch (e) { setError(e.response?.data?.message || 'Delete failed'); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
  const gt = (v) => { if (!v) return ''; if (typeof v === 'string' && v.includes(':')) return v; const m = parseInt(v); if (isNaN(m)) return v; return `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`; };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-8 py-6 max-w-md"><p className="mb-4">{error}</p><Link to="/history" className="btn-secondary text-sm">Back to History</Link></div></div>;
  if (!itinerary) return <div className="text-center py-20"><p className="text-gray-500">Not found</p><Link to="/history" className="btn-secondary mt-4">Back</Link></div>;

  if (itinerary.status === 'generating') {
    const [step, setStep] = useState(0);
    const steps = ["Extracting Data...", "Understanding your travel plan...", "Generating itinerary with AI..."];
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🌍</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Processing</h2>
          <div className="space-y-4">
            {steps.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < step ? 'bg-green-100 text-green-600' : i === step ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`font-medium ${i === step ? 'text-blue-700' : 'text-gray-600'}`}>{t}</span>
              </div>
            ))}
          </div>
          <button onClick={loadItinerary} className="btn-secondary w-full mt-8">Refresh</button>
        </div>
      </div>
    );
  }

  if (itinerary.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-8 py-6 max-w-md w-full text-center">
          <p className="font-semibold mb-2">Generation Failed</p>
          <p className="text-sm mb-4">Check your API key configuration.</p>
          <Link to="/history" className="btn-secondary text-sm">Back to History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{itinerary.title}</h1>
              <p className="text-lg text-gray-500 mt-1">{itinerary.destination} &middot; {fmt(itinerary.startDate)} to {fmt(itinerary.endDate)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-600 bg-blue-100 p-1.5 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Destination</p>
                <p className="font-semibold text-gray-900">{itinerary.destination}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600 bg-green-100 p-1.5 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Duration</p>
                <p className="font-semibold text-gray-900">{fmt(itinerary.startDate)} to {fmt(itinerary.endDate)}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600 bg-purple-100 p-1.5 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Activities</p>
                <p className="font-semibold text-gray-900">{itinerary.summary?.totalActivities || 0} activities across {itinerary.summary?.totalDays || 0} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Days */}
        {itinerary.days && itinerary.days.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" /> Day Wise Plan
            </h2>
            <div className="space-y-8">
              {itinerary.days.map((day) => (
                <div key={day.date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">D{day.dayNumber}</div>
                    <h3 className="text-lg font-bold text-gray-900">Day {day.dayNumber} &mdash; {fmt(day.date)}</h3>
                    {day.notes && <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{day.notes}</span>}
                  </div>
                  <div className="space-y-3 ml-14">
                    {day.activities.map((a, i) => (
                      <div key={i} className="card p-4 border-l-4 border-l-blue-400">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-blue-700">{gt(a.time || 0)}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{a.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                            {a.location && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</p>}
                            <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${a.category === 'transport' ? 'bg-blue-100 text-blue-700' :
                                a.category === 'accommodation' ? 'bg-green-100 text-green-700' :
                                  a.category === 'food' ? 'bg-yellow-100 text-yellow-700' :
                                    a.category === 'attraction' ? 'bg-purple-100 text-purple-700' :
                                      'bg-gray-100 text-gray-600'
                              }`}>{a.category}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {itinerary.summary?.highlights?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Highlights</h2>
                <ul className="space-y-2">{(itinerary.summary.highlights).map((h, i) => <li key={i} className="flex items-start gap-2 text-gray-700"><span className="text-blue-500 mt-1">•</span> {h}</li>)}</ul>
              </div>
            )}
            {itinerary.summary?.tips?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-500" /> Tips</h2>
                <div className="card"><ul className="space-y-2">{(itinerary.summary.tips).map((t, i) => <li key={i} className="flex items-start gap-2 text-gray-700"><span className="text-blue-500 mt-1">•</span> {t}</li>)}</ul></div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20"><p className="text-gray-500">No itinerary details available yet.</p></div>
        )}

        {/* Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {itinerary.documents?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Based on:</span>
              {itinerary.documents.map(d => <span key={d._id} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{d.originalName}</span>)}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {!itinerary.isShared && <button onClick={handleShare} disabled={itinerary.status !== 'completed'} className="btn-secondary px-4 py-2 flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</button>}
            {shareLink && (
              <div className="flex items-center gap-2">
                <input type="text" value={shareLink} readOnly className="input-field text-sm w-48" />
                <button onClick={handleCopy} className="btn-secondary px-3 py-2 flex items-center gap-1">{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}</button>
              </div>
            )}
            <Link to="/history" className="btn-secondary px-4 py-2">Back</Link>
            <button onClick={handleDelete} className="btn-danger px-4 py-2 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
