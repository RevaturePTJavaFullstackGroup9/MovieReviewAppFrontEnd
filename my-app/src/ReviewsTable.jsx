// ReviewsTable.jsx
import React, { useEffect, useState } from 'react';

export default function ReviewsTable({ baseUrl = '' }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${baseUrl}/reviews`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (mounted) setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load reviews');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [baseUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${baseUrl}/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } catch (err) {
      alert('Failed to delete review: ' + (err.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-4">Loading reviews...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Reviews in DB</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.movieId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.score}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.comment || '-'}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === review.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
