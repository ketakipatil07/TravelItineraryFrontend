import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { itineraries } from '../../api/axios';

export default function SharedView() {
  const { code } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSharedItinerary();
  }, [code]);

  const loadSharedItinerary = async () => {
    try {
      setLoading(true);
      const res = await itineraries.getShared(code);
      setItinerary(res.data.itinerary);
    } catch (err) {
      setError(err.response?.data?.message || 'Shared itinerary not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 text-lg rounded-lg px-8 py-6 max-w-md w-full text-center">
          {error}
          <div className="mt-6">
            <a href="/" className="btn-secondary">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="bg-gray-50 border border-gray-200 text-gray-600 text-lg rounded-lg px-8 py-6 max-w-md w-full text-center">
          Shared itinerary not available
          <div className="mt-6">
            <a href="/" className="btn-secondary mt-4">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTimeLabel = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{itinerary.title}</h1>
              <p className="text-gray-600">
                Shared travel itinerary • {formatDate(itinerary.startDate)} to {formatDate(itinerary.endDate)}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Shared by {itinerary.user?.name || 'a traveler'} •
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">
                  View code: {itinerary.shareCode}
                </span>
              </p>
            </div>
          </div>
        </div>

        {itinerary.days && itinerary.days.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 flex items-center justify-center text-indigo-600 rounded">
                  📅
                </span>
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-6">
                {itinerary.days.map((day) => (
                  <div key={day.date} className="border-l-4 border-indigo-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Day {day.dayNumber} • {formatDate(day.date)}
                      </h3>
                      {day.notes && (
                        <span className="text-sm bg-indigo-50 text-indigo-800 px-3 py-1 rounded">
                          Note: {day.notes}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 rounded flex items-center justify-center">
                              <span className="text-xs text-indigo-600 font-medium">{getTimeLabel(activity.time || 0)}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{activity.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              {activity.location && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    {activity.location}
                                  </span>
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${{
                                    transport: 'bg-blue-100 text-blue-800',
                                    accommodation: 'bg-green-100 text-green-800',
                                    food: 'bg-yellow-100 text-yellow-800',
                                    attraction: 'bg-purple-100 text-purple-800',
                                    free_time: 'bg-gray-100 text-gray-800',
                                  }[activity.category] || 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {activity.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {itinerary.summary?.highlights && itinerary.summary.highlights.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-yellow-100 flex items-center justify-center text-yellow-600 rounded">
                    ⭐
                  </span>
                  Trip Highlights
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {itinerary.summary.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {itinerary.summary?.tips && itinerary.summary.tips.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 flex items-center justify-center text-green-600 rounded">
                    💡
                  </span>
                  Travel Tips
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {itinerary.summary.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No itinerary details available</p>
          </div>
        )}
      </div>
    </div>
  );
}
