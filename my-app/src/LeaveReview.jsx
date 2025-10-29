// src/components/LeaveReview.jsx
import React, { useState } from "react";

/**
 * LeaveReview
 *
 * Props:
 *  - movieId (required)         : id of the movie to post the review for
 *  - onPosted(review) (optional): callback invoked with created review after success
 *  - authToken (optional)       : bearer token if your API requires authentication
 *
 * This component renders a small form to submit a movie review. It performs
 * simple client-side validation, posts JSON to the backend, and clears the form
 * on success. An optional onPosted callback allows parent components to refresh
 * UI or update local state after a successful post.
 */
export default function LeaveReview({ movieId, onPosted, authToken }) {
    // Form field state
    const [title, setTitle] = useState("");       // review title
    const [stars, setStars] = useState(8);        // star rating (1-10), default 8
    const [text, setText] = useState("");         // review body / text
    const [username, setUsername] = useState(""); // optional display name for non-auth users

    // UI state
    const [loading, setLoading] = useState(false); // true while POST in progress
    const [error, setError] = useState("");        // error message shown to user

    // If no movieId was provided, render nothing (parent should supply movieId)
    if (!movieId) return null;

    // Form submit handler: validates values, posts to API, handles response
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Simple client-side validation
        if (!title.trim()) return setError("Title is required");
        if (!text.trim()) return setError("Review text is required");
        if (!Number.isFinite(Number(stars)) || stars < 1 || stars > 10)
            return setError("Stars must be between 1 and 10");

        // Build payload for request
        const payload = {
            title: title.trim(),
            stars: Number(stars),
            text: text.trim()
        };
        // Include optional username if provided
        if (username.trim()) payload.username = username.trim();

        setLoading(true);
        try {
            // Build headers and include auth token when provided
            const headers = { "Content-Type": "application/json" };
            if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

            // POST to backend endpoint for reviews of this movie
            const res = await fetch(`/api/movies/${movieId}/reviews`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
            });

            // If server responds with non-2xx, try to extract body for better debugging
            if (!res.ok) {
                const body = await res.text();
                throw new Error(`Post failed ${res.status}: ${body}`);
            }

            // Assume backend returns the created review object
            const created = await res.json();

            // Clear the form after successful post
            setTitle("");
            setText("");
            setStars(8);
            setUsername("");

            // Notify parent if callback provided
            if (typeof onPosted === "function") onPosted(created);
        } catch (err) {
            // Log and show a friendly message
            console.error(err);
            setError(err.message || "Failed to post review");
        } finally {
            setLoading(false);
        }
    }

    // Render the form UI
    return (
        <form
            onSubmit={handleSubmit}
            style={{
                marginTop: 16,
                border: "1px solid #eee",
                padding: 12,
                borderRadius: 8
            }}
        >
            <h3 style={{ marginTop: 0 }}>Leave a review</h3>

            {/* Title input */}
            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 13 }}>Title</div>
                <input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                    maxLength={120}
                />
            </label>

            {/* Stars slider */}
            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 13 }}>Stars (1–10)</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {/* range input updates numeric stars */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={stars}
                        onChange={(e) => setStars(Number(e.target.value))}
                    />
                    {/* display current numeric rating */}
                    <div style={{ minWidth: 36, textAlign: "center", fontWeight: 700 }}>
                        {stars}
                    </div>
                </div>
            </label>

            {/* Review text area */}
            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 13 }}>Review</div>
                <textarea
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ ...inputStyle, minHeight: 90 }}
                />
            </label>

            {/* Optional username input for flows without authentication */}
            <label style={{ display: "block", marginBottom: 8 }}>
                <div style={{ fontSize: 13 }}>Name (optional)</div>
                <input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyle}
                />
            </label>

            {/* Show error message if present */}
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

            {/* Actions: submit and clear */}
            <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "Posting…" : "Post review"}
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                        // reset fields when 'Clear' clicked
                        setTitle("");
                        setText("");
                        setStars(8);
                        setUsername("");
                    }}
                    style={{ ...buttonStyle, background: "#f3f3f3", color: "#222" }}
                >
                    Clear
                </button>
            </div>
        </form>
    );
}

// Shared inline styles for inputs
const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: 14
};

// Shared button style
const buttonStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#0b5cff",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer"
};
