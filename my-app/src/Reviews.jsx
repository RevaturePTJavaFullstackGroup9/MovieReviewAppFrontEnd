// src/components/Reviews.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const refreshUserIdToUserName = (reviews, setUserIdToUserName) => {(async (reviews, setUserIdToUserName) => {
    const userIdToUserName = await reviews.reduce(
        async (mapPromise, review)=>{
            const map = await mapPromise.then(map => map);
            try{
                const response = await axios.get(`http://localhost:8080/users/${review.userId}`);
                map.set(review.userId, response.data.username);
            }
            catch (e){
                console.error(`Error getting username from id ${review.userId}, error="${e}"`)
            }
            return Promise.resolve(map);
        }, Promise.resolve(new Map())
    );
    setUserIdToUserName(userIdToUserName);
}  
)(reviews, setUserIdToUserName);};

const refreshUserIdToUserName2 = (reviews, setUserIdToUserName) => {
    (
        async () => {
            const userIdToUserName = await reviews.reduce(
                async (mapPromise, review)=> {
                    const map = await mapPromise.then(map => map);
                    try{
                        const response = await axios.get(`http://localhost:8080/users/${review.userId}`);
                        map.set(review.userId, response.data.username);
                    }
                    catch (e){
                        console.error(`Error getting username from id ${review.userId}, error="${e}"`)
                    }
                    return Promise.resolve(map);
                }, Promise.resolve(new Map())
            );
            setUserIdToUserName(userIdToUserName);
        } 
    )(); // IIFE 
};


/**
 * Reviews component
 *
 * Props:
 *  - movieId (required)    : id of the movie to load reviews for
 *  - pollInterval (optional): ms to auto-refresh reviews (default: 0 = no polling)
 *
 * This component fetches reviews from the server, handles loading/error state,
 * optionally polls for updates, and renders a simple list of reviews with a
 * small star display component.
 */
export default function Reviews({ movieId, pollInterval = 0 , reviewPosted, editsMade}) {
    // reviews array from the server
    const [reviews, setReviews] = useState([]);
    // loading indicator while fetching
    const [loading, setLoading] = useState(true);
    // error message to display on fetch failure
    const [error, setError] = useState("");

    const [userIdToUserName, setUserIdToUserName] = useState(new Map());

    useEffect(() => {
        // if no movieId provided, don't attempt to load
        if (!movieId) return;
        // mounted flag to avoid setting state after unmount
        let mounted = true;
        // timer id for polling (if enabled)
        let timer;

        // async function to load reviews from the API
        async function load() {
            // start loading
            setLoading(true);
            setError("");
            try {
                // fetch reviews endpoint for the given movieId
                const res = await fetch(`/api/movies/${movieId}/reviews`);
                // throw on non-2xx responses to trigger catch
                if (!res.ok) throw new Error(`Failed to load reviews (${res.status})`);
                const data = await res.json();
                // only update state if component is still mounted
                if (!mounted) return;
                // ensure reviews is an array before setting
                setReviews(Array.isArray(data) ? data : []);
            } catch (e) {
                // log and set an error message (if still mounted)
                console.error(e);
                if (mounted) setError(e.message || "Failed to load reviews");
            } finally {
                // stop loading indicator (if still mounted)
                if (mounted) setLoading(false);
            }
        }

        // initial load
        load();
        // setup polling if a positive pollInterval was provided
        if (pollInterval > 0) timer = setInterval(load, pollInterval);

        // cleanup on unmount or when movieId/pollInterval change
        return () => {
            mounted = false;
            if (timer) clearInterval(timer);
        };
        // re-run effect when movieId or pollInterval change
    }, [movieId, pollInterval, reviewPosted, editsMade]);

    useEffect(() => refreshUserIdToUserName2(reviews, setUserIdToUserName), [reviews]);

    // don't render anything if no movieId provided
    if (!movieId) return null;

    return (
        <section aria-labelledby="reviews-heading" style={{ marginTop: 24 }}>
            <h2 id="reviews-heading" style={{ marginBottom: 8 }}>Reviews</h2>

            {/* loading and error states */}
            {loading && <div>Loading reviews…</div>}
            {error && <div style={{ color: "crimson" }}>{error}</div>}

            {/* empty state when there are no reviews */}
            {!loading && !error && reviews.length === 0 && (
                <div style={{ color: "#666" }}>No reviews yet — be the first to review this movie.</div>
            )}

            {/* list of reviews */}
            <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
                {reviews.map((r) => (
                    <li key={r.reviewId} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            {/* review title (fall back to "Untitled") */}
                            <div style={{ fontWeight: 700 }}>{r.reviewTitle || "Untitled"}</div>
                            {/* formatted creation date */}
                            <div style={{ color: "#666", fontSize: 13 }}>{formatDate(r.createdAt)}</div>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                            {/* star visualization and reviewer name */}
                            <StarDisplay stars={r.reviewScore} />
                            <span style={{ color: "#333", fontWeight: 600 }}>{userIdToUserName.get(r.userId) ?? "Loading..."}</span>
                        </div>

                        {/* review text (preserve line breaks) */}
                        <p style={{ marginTop: 8, marginBottom: 0, whiteSpace: "pre-wrap" }}>{r.reviewText}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/**
 * formatDate
 *
 * Convert an ISO date/string to a localized date. Returns an empty string for falsy input.
 * If parsing fails, return the original string.
 */
function formatDate(s) {
    if (!s) return "";
    try {
        const d = new Date(s);
        return d.toLocaleDateString();
    } catch {
        return s;
    }
}

/** Simple star display component showing a numeric score and 10 small star icons.
 *
 * Props:
 *  - stars: number (expected 0..10)
 */
function StarDisplay({ stars = 0 }) {
    // clamp the star count between 0 and 10 and ensure numeric type
    const clamped = Math.max(0, Math.min(10, Number(stars || 0)));
    return (
        // aria-hidden because this is decorative; the numeric value is shown as text
        <div aria-hidden style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
            {/* numeric score */}
            <span style={{ fontSize: 13, color: "#444" }}>{clamped}</span>
            {/* 10 star icons; filled color for stars < clamped */}
            <div style={{ display: "inline-flex", gap: 2 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < clamped ? "#f6b01d" : "#e6e6e6"} aria-hidden>
                        <path d="M12 .587l3.668 7.431L24 9.587l-6 5.847 1.416 8.266L12 18.896 4.584 23.7 6 15.434 0 9.587l8.332-1.569z"/>
                    </svg>
                ))}
            </div>
        </div>
    );
}
