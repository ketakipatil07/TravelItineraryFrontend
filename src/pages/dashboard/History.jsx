import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itineraries } from '../../api/axios';
import ItineraryCard from '../../components/ui/Card';
import { Search, Filter, Upload } from 'lucide-react';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setLoading(true); const res = await itineraries.getAll(); setData(res.data.itineraries); }
    catch (e) { setError(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const filtered = data.filter(it => {
    const m = (it.title + ' ' + (it.destination || '')).toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || (filter === 'shared' && it.isShared) || (filter === 'private' && !it.isShared);
    return m && s;
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-8 py-6"><p className="mb-4">{error}</p><Link to="/dashboard" className="btn-secondary text-sm">Back</Link></div></div>;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Itinerary History</h1>
          <p className="text-gray-500 mb-6">{data.length} saved trips</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search destinations or titles..." value={search} onChange={e => setSearch(e.target.value)} className="input-field flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field">
                <option value="all">All</option>
                <option value="shared">Shared</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            {search || filter !== 'all' ? (
              <>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No results</h2>
                <p className="text-gray-500">Try different search terms or filters.</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No itineraries yet</h2>
                <p className="text-gray-500 mb-6">Upload documents and generate your first AI itinerary.</p>
                <Link to="/dashboard" className="btn-primary px-8 py-3">Go to Dashboard</Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(it => <ItineraryCard key={it._id} itinerary={it} />)}
          </div>
        )}
      </div>
    </div>
  );
}
