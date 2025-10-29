// src/MovieGrid.jsx
// A simple responsive grid to display movie posters with accessible keyboard/mouse navigation.
// Props:
// - movies: array of movie objects { id, title, posterUrl } (defaults to empty array).
// - colsMinWidth: minimum column width used in CSS grid (defaults to 160).
import React from "react";
import { useNavigate } from "react-router-dom";

// Fallback poster shown when a movie has no posterUrl or when image fails to load.
const PLACEHOLDER_URL = "/poster-placeholder.png";

export default function MovieGrid({ movies = [], colsMinWidth = 160 }) {
    const navigate = useNavigate();

    // If there are no movies, show a simple message and exit early.
    if (!movies || movies.length === 0) return <div style={{ padding: 16 }}>No movies to display.</div>;

    return (
        <div style={{ padding: 16 }}>
            {/* CSS grid container: auto-fill columns with a minimum width per column */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(${colsMinWidth}px, 1fr))`,
                    gap: 16,
                }}
            >
                {movies.map((m) => (
                    // Each movie is an accessible interactive article element:
                    // - role="button" and tabIndex to make it keyboard-focusable
                    // - onClick and onKeyDown to handle mouse and Enter-key activation
                    <article
                        key={m.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/movies/${m.id}`)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") navigate(`/movies/${m.id}`);
                        }}
                        // Visual styling and layout for card-like appearance
                        style={{
                            cursor: "pointer",
                            borderRadius: 8,
                            overflow: "hidden",
                            background: "#fff",
                            boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
                            userSelect: "none",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        aria-label={`Open details for ${m.title}`}
                    >
                        {/* Poster container keeps aspect ratio using padding-top trick */}
                        <div style={{ width: "100%", paddingTop: "150%", position: "relative", background: "#efefef" }}>
                            <img
                                // Use posterUrl if available; otherwise fallback to placeholder
                                src={m.posterUrl || PLACEHOLDER_URL}
                                alt={m.title}
                                loading="lazy"
                                // Position the image absolutely to cover the poster container
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                // If image fails to load, replace src with placeholder
                                onError={(e) => {
                                    e.currentTarget.src = PLACEHOLDER_URL;
                                }}
                            />
                        </div>

                        {/* Title area: truncated if too long, with title attribute for full text */}
                        <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}
                                title={m.title}
                            >
                                {m.title}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
