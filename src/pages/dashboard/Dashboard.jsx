import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { documents, itineraries } from '../../api/axios';
import DropZone from '../../components/common/DropZone';
import ItineraryCard from '../../components/ui/Card';
import { Upload, ShieldCheck, List, Calendar, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [itins, setItins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const hasPending = docs.some(d => d.processingStatus === 'processing' || d.processingStatus === 'pending');
    if (hasPending) {
      const interval = setInterval(refreshDocs, 3000);
      return () => clearInterval(interval);
    }
  }, [docs]);

  const refreshDocs = async () => {
    try {
      const res = await documents.getAll();
      setDocs(res.data.documents);
    } catch (e) {
      console.error('Failed to refresh docs', e);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, iRes] = await Promise.all([documents.getAll(), itineraries.getAll()]);
      setDocs(dRes.data.documents);
      setItins(iRes.data.itineraries);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append('document', file);
    try {
      const res = await documents.upload(fd);
      setDocs(p => [res.data.document, ...p]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documents.remove(id);
      setDocs(p => p.filter(d => d._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleGenerate = async () => {
    const completed = docs.filter(d => d.processingStatus === 'completed');
    if (!completed.length) { alert('Please wait for documents to finish processing'); return; }
    try {
      const res = await itineraries.generate({ documentIds: completed.map(d => d._id) });
      setItins(p => [res.data.itinerary, ...p]);
      navigate(`/itinerary/${res.data.itinerary._id}`);
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  const completedCount = docs.filter(d => d.processingStatus === 'completed').length;
  const pendingCount = docs.filter(d => d.processingStatus === 'processing' || d.processingStatus === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="gradient-bg rounded-2xl p-8 md:p-12 text-center shadow-lg">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to TravelAI</h1>
          <p className="text-lg text-gray-600">Upload your travel documents and let AI create a perfect itinerary</p>
          <button onClick={handleGenerate} disabled={!completedCount}
            className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2 mx-auto">
            <Upload className="w-5 h-5" /> {completedCount ? 'Generate Itinerary' : 'Upload Documents First'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Upload, label: 'Uploaded', count: docs.length, color: 'blue' },
          { icon: ShieldCheck, label: 'Ready', count: completedCount, color: 'green' },
          { icon: List, label: 'Itineraries', count: itins.length, color: 'purple' },
          { icon: Calendar, label: 'Processing', count: pendingCount, color: 'amber' },
        ].map((s, i) => (
          <div key={i} className="card hover-lift flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-100 text-blue-600' : s.color === 'green' ? 'bg-green-100 text-green-600' : s.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Upload Travel Documents</h2>
          <span className="text-sm text-gray-500">{docs.length} uploaded</span>
        </div>
        <DropZone onFileUpload={handleUpload} />
        <div className="flex flex-wrap gap-2">
          {['PDF', 'JPG', 'PNG', 'WEBP', 'TIFF'].map(f => (
            <span key={f} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{f}</span>
          ))}
        </div>
      </section>

      {/* Documents preview */}
      {docs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Documents</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {docs.slice(0, 6).map(doc => (
              <div key={doc._id} className={`card p-4 border-l-4 ${doc.processingStatus === 'completed' ? 'border-l-green-500 bg-green-50/30' : doc.processingStatus === 'processing' ? 'border-l-yellow-500 bg-yellow-50/30' : doc.processingStatus === 'failed' ? 'border-l-red-500 bg-red-50/30' : 'border-l-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {doc.mimeType === 'application/pdf'
                      ? <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
                      : <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 12m-8 4l1.586-1.586a2 2 0 012.828 0L12 12m2 2l1.586-1.586a2 2 0 012.828 0L16 8m-8 4v8H4V4h16v12a2 2 0 01-2 2H4z" /></svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.originalName}</p>
                    <p className="text-xs text-gray-500">{doc.documentType} • {Math.round(doc.size / 1024)} KB</p>
                    <span className={`text-xs font-medium ${doc.processingStatus === 'completed' ? 'text-green-600' :
                      doc.processingStatus === 'processing' ? 'text-yellow-600' :
                        doc.processingStatus === 'failed' ? 'text-red-600' : 'text-gray-500'
                      }`}>{doc.processingStatus}</span>
                  </div>
                  <button onClick={() => handleDeleteDoc(doc._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete document">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Itineraries */}
      {itins.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Itineraries</h2>
            <Link to="/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itins.slice(0, 3).map(it => <ItineraryCard key={it._id} itinerary={it} />)}
          </div>
        </section>
      )}

      {!itins.length && !docs.length && (
        <div className="text-center py-20">
          <Upload className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
          <p className="text-gray-500 mb-6">Upload your travel documents to generate AI-powered itineraries.</p>
          <Link to="/register" className="btn-primary px-8 py-3">Create Account</Link>
        </div>
      )}
    </div>
  );
}
