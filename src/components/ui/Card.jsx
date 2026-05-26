import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Share2 } from 'lucide-react';

export default function ItineraryCard({ itinerary }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';

  return (
    <Link to={`/itinerary/${itinerary._id}`} className="block">
      <div className="card hover-lift p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{itinerary.title}</h3>
            <p className="text-sm text-gray-500 truncate">{itinerary.destination || 'Unknown'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {fmt(itinerary.startDate)}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {itinerary.summary?.totalDays || 0} days</span>
          {itinerary.isShared && <span className="flex items-center gap-1 text-purple-600"><Share2 className="w-4 h-4" /> Shared</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">{itinerary.summary?.totalActivities || 0} activities</span>
          {itinerary.status === 'generating' && <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">Processing...</span>}
        </div>
      </div>
    </Link>
  );
}
