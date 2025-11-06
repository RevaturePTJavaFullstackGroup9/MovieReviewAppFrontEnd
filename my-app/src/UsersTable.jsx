// UsersTable.jsx
import React, { useEffect, useState } from 'react';

/*
    UsersTable
    - Fetches and displays a list of users from GET <baseUrl>/users
    - Allows deleting a user via DELETE <baseUrl>/users/:id
    - Props:
            - baseUrl (string) : optional base URL for API endpoints (default: '')
    Notes:
    - This file intentionally does not send Authorization headers or credentials.
    - Adjust fetch options if your backend requires auth or cookies.
*/

export default function UsersTable({ baseUrl = '' }) {
    // Local state
    const [users, setUsers] = useState([]); // array of user objects
    const [loading, setLoading] = useState(true); // loading indicator while fetching
    const [error, setError] = useState(null); // holds error message (if any)
    const [deletingId, setDeletingId] = useState(null); // id currently being deleted

    // Fetch users when component mounts or when baseUrl changes
    useEffect(() => {
        let mounted = true; // flag to avoid state updates after unmount
        setLoading(true);
        setError(null);

        (async () => {
            try {
                // Perform GET request to fetch users
                const res = await fetch(`${baseUrl}/users`, { method: 'GET' });

                // Normalize and inspect response headers
                const contentType = res.headers.get('content-type') || '';

                // If server responded with non-2xx, read text and throw an error
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }

                // Expect JSON response; if not JSON, throw with response text for debugging
                if (!contentType.includes('application/json')) {
                    const txt = await res.text();
                    throw new Error(`Expected JSON but got ${contentType}. Response:\n\n${txt}`);
                }

                // Parse JSON and set users (ensure it's an array)
                const data = await res.json();
                if (mounted) setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                // Save a readable error message for UI
                if (mounted) setError(err.message || 'Failed to load users');
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        // Cleanup to prevent state updates after unmount
        return () => {
            mounted = false;
        };
    }, [baseUrl]);

    // Handler to delete a user by id
    async function handleDelete(id) {
        // Confirm destructive action with the user
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            setDeletingId(id); // mark id as deleting to disable button / show progress

            // Send DELETE request to backend
            const res = await fetch(`${baseUrl}/users/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                // Try to read server error message for debugging
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            // Optimistically update UI: remove deleted user from list
            setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
        } catch (err) {
            // Simple user feedback; replace with a toast/notification system if available
            alert('Failed to delete user: ' + (err.message || 'Unknown error'));
        } finally {
            setDeletingId(null); // reset deleting state
        }
    }

    // Render loading state
    if (loading) {
        return (
            <div className="p-4">
                <div className="text-gray-700">Loading users...</div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-4">
                {/* whiteSpace: 'pre-wrap' preserves newline formatting from error messages */}
                <div className="text-red-600" style={{ whiteSpace: 'pre-wrap' }}>Error: {error}</div>
            </div>
        );
    }

    // Main table UI
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Users in DB</h2>
                <div className="text-sm text-gray-500">Total Users Registered: {users.length}</div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Table headers */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Delete?</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* If no users, show a friendly message */}
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    {/* Defensive rendering: fallbacks for different property names / missing values */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username || user.userName || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Delete button: disabled while a delete is in progress for this id */}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deletingId === user.id}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletingId === user.id ? 'Deleting...' : 'Delete'}
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

/*
Usage:
import UsersTable from './UsersTable';

// If your backend runs on a different origin, pass baseUrl e.g. 'http://localhost:8080'
<UsersTable baseUrl="http://localhost:8080" />

Notes:
- This component expects the GET /users endpoint to return an array of user objects.
- The component will send Authorization: Bearer <token> if you store a token in localStorage under 'token'. Remove that behavior if not needed.
- If your backend uses cookies for auth, keep credentials: 'include'. If not, remove the credentials option.
- Make sure CORS is enabled on your backend for the origin serving this React app.
*/
