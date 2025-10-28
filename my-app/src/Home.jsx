// src/pages/Home.jsx
// - Home page component for the Movie Review App.
// - Fetches list of movies from the backend API on mount.
// - Shows loading and error states.
// - Renders MovieGrid with fetched movies.

import React, { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid"; // child component that displays movies in a grid

export default function Home() {
  // local component state
  const [movies, setMovies] = useState([]); // array of movie objects retrieved from API
  const [loading, setLoading] = useState(true); // whether the fetch is in progress
  const [error, setError] = useState(""); // error message to display if fetch fails

  useEffect(() => {
    // `mounted` prevents state updates after the component unmounts
    let mounted = true;
    setLoading(true);

    // Fetch movies from the backend endpoint
    fetch("/api/movies")
      .then((res) => {
        // If response is not OK, throw to be handled in the catch block
        if (!res.ok) throw new Error(`GET /api/movies failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return; // avoid calling setState on an unmounted component
        setMovies(data || []); // set movies (use empty array as fallback)
      })
      .catch((err) => {
        // Log and surface a readable error message
        console.error(err);
        if (mounted) setError(err.message);
      })
      .finally(() => {
        // Always turn off loading when the fetch is settled
        if (mounted) setLoading(false);
      });

    // Cleanup function: flip the mounted flag so pending promises won't update state
    return () => {
      mounted = false;
    };
  }, []); // empty dependency array: run once when component mounts

  return (
    <div style={{ padding: "20px" }}>

      <h1>Flick Feed</h1>
      <p>Welcome to the Movie Review App!</p>

      {/* Show a simple loading indicator while fetching */}
      {loading && <div>Loading movies…</div>}

      {/* Show any fetch error in a visible color */}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {/* Once loaded and no error, render the MovieGrid with the movies prop */}
      {!loading && !error && <MovieGrid movies={movies} />}
      
    </div>
  );
}
