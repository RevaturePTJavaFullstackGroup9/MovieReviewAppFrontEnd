// src/MovieDetails.jsx
// Component for displaying detailed information about a single movie.
// Fetches movie data from the backend API using the route param `id` and
// renders a poster, metadata, cast, and a collapsible raw JSON view.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PLACEHOLDER = "/poster-placeholder.png"; // fallback image when poster is missing or fails to load

export default function MovieDetails() {
    // read the movie id from the URL and get a navigate helper
    const { id } = useParams();
    const navigate = useNavigate();

    // local UI state
    const [movie, setMovie] = useState(null); // fetched movie object
    const [loading, setLoading] = useState(true); // loading indicator
    const [error, setError] = useState(""); // error message, if any

    // fetch movie data when the id changes
    useEffect(() => {
        if (!id) return; // nothing to load if no id present

        let mounted = true; // flag to avoid setting state after unmount
        setLoading(true);
        setError("");

        // request the movie by id from our API
        fetch(`/api/movies/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Movie not found (${res.status})`);
                return res.json();
            })
            .then((data) => {
                if (mounted) setMovie(data); // only set state if component is still mounted
            })
            .catch((err) => {
                console.error(err);
                if (mounted) setError(err.message || "Failed to load movie");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        // cleanup: flip mounted to false to prevent state updates
        return () => {
            mounted = false;
        };
    }, [id]);

    // show loading state
    if (loading) return <div style={{ padding: 20 }}>Loading movie…</div>;

    // show error state with a back button
    if (error)
        return (
            <div style={{ padding: 20 }}>
                <div style={{ color: "crimson" }}>{error}</div>
                <button onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
                    Back
                </button>
            </div>
        );

    // if fetch completed but no movie found
    if (!movie) return <div style={{ padding: 20 }}>Movie not found</div>;

    // main render for movie details
    return (
        <div style={{ padding: 20, fontFamily: "system-ui, Arial, sans-serif" }}>
            {/* Back button to return to previous view */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                ← Back
            </button>

            {/* two-column layout: poster on the left, details on the right */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(200px, 320px) 1fr",
                    gap: 20,
                    alignItems: "start",
                }}
            >
                <div>
                    {/* poster image: uses a placeholder if missing, and resets to placeholder on error */}
                    <img
                        src={movie.posterUrl || PLACEHOLDER}
                        alt={`${movie.title} poster`}
                        onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                        }}
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: 320,
                            borderRadius: 8,
                            boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                            objectFit: "cover",
                        }}
                        loading="lazy"
                    />
                </div>

                <div>
                    {/* title and basic metadata */}
                    <h1 style={{ marginTop: 0 }}>{movie.title}</h1>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                        <div>
                            <strong>Director:</strong> {movie.director ?? "—"}
                        </div>
                        <div>
                            <strong>Genre:</strong> {movie.genre ?? "—"}
                        </div>
                        <div>
                            <strong>Release:</strong> {movie.releaseDate ?? "—"}
                        </div>
                        <div>
                            <strong>Sales:</strong> {movie.salesMillions ?? "—"}
                        </div>
                    </div>

                    {/* simple cast list (2 leads shown) */}
                    <div style={{ marginBottom: 12 }}>
                        <strong>Cast:</strong>
                        <ul>
                            <li>{movie.leadActor1 ?? "—"}</li>
                            <li>{movie.leadActor2 ?? "—"}</li>
                        </ul>
                    </div>

                    {/* collapsible raw JSON for debugging or inspection */}
                    <details style={{ marginTop: 12 }}>
                        <summary style={{ cursor: "pointer" }}>Raw data</summary>
                        <pre
                            style={{
                                maxHeight: 240,
                                overflow: "auto",
                                background: "#f6f6f6",
                                padding: 8,
                            }}
                        >
                            {JSON.stringify(movie, null, 2)}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );
}
