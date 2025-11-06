// import React hooks used in this component
import { useEffect, useState } from "react"; // bring in useEffect and useState
import UsersTable from './UsersTable';
import ReviewsTable from './ReviewsTable';


/**
 * AdminMovies - single-file admin UI for:
 *  - listing movies (GET /api/movies)
 *  - adding a movie (POST /api/admin/movies)
 *  - deleting a movie (DELETE /api/admin/movies/{id})
 *  - deleting all movies (client issues multiple DELETEs)
 *
 * Notes:
 *  - If your backend expects snake_case JSON, set SEND_SNAKE_CASE = true.
 *  - This component uses the Vite proxy (or browser same-origin) to call /api.
 */

// Toggle this to true only if backend expects snake_case JSON keys
const SEND_SNAKE_CASE = false; // flag to control payload key format

// Convert UI form state into request payload (snake_case optional)
const toPayload = (form) => {
  // build payload in camelCase from form state, normalizing empty strings to null for some fields
  const payload = {
    title: form.title || null, // title or null
    director: form.director || null, // director or null
    genre: form.genre || null, // genre or null
    leadActor1: form.leadActor1 || null, // leadActor1 or null
    leadActor2: form.leadActor2 || null, // leadActor2 or null
    releaseDate: form.releaseDate || null, // releaseDate string "YYYY-MM-DD" or null
    salesMillions: form.salesMillions === "" ? null : Number(form.salesMillions), // convert sales to Number or null
    posterUrl: form.posterUrl || null, // NEW
    synopsis: form.synopsis || null
  };

  if (!SEND_SNAKE_CASE) return payload; // return camelCase payload unless snake_case requested

  // backend expects snake_case keys -> map camelCase payload to snake_case keys
  return {
    title: payload.title,
    director: payload.director,
    genre: payload.genre,
    lead_actor_1: payload.leadActor1,
    lead_actor_2: payload.leadActor2,
    release_date: payload.releaseDate,
    sales_millions: payload.salesMillions,
    poster_url: payload.posterUrl,
    synopsis: payload.synopsis
  };
};

// Empty form template used to reset the form
const emptyForm = {
  title: "", // empty title field
  director: "", // empty director field
  genre: "", // empty genre field
  leadActor1: "", // empty lead actor 1
  leadActor2: "", // empty lead actor 2
  releaseDate: "", // empty release date
  salesMillions: "", // empty sales field
  posterUrl: "",
  synopsis: ""
};

export default function AdminMovies() {
  // state: movies list, form fields, loading flag, and error message
  const [movies, setMovies] = useState([]); // list of movies from server
  const [form, setForm] = useState({ ...emptyForm }); // controlled form state initialized to emptyForm
  const [loading, setLoading] = useState(false); // loading indicator for async ops
  const [error, setError] = useState(""); // error message to show to user

 

  /* Load all movies from backend */
  const load = async () => {
    setLoading(true); // show loading
    setError(""); // clear previous error
    try {
      const res = await fetch("/api/movies"); // GET /api/movies
      if (!res.ok) throw new Error(`GET /api/movies failed: ${res.status}`); // throw on bad status
      const data = await res.json(); // parse JSON body
      setMovies(data); // put movies into state
    } catch (err) {
      setError(err.message); // store error message
      setMovies([]); // clear movies to avoid showing stale data
    } finally {
      setLoading(false); // always clear loading flag
    }
  };

  /* on mount, load movies once */
  useEffect(() => {
    load(); // call load when component first mounts
  }, []); // empty deps => run once

  /* controlled inputs handler */
  const onChange = (e) => {
    const { name, value } = e.target; // extract input name and value
    setForm((p) => ({ ...p, [name]: value })); // update corresponding form field
  };

  /* Add a single movie (POST) */
  const addMovie = async (e) => {
    e.preventDefault(); // prevent default form submit navigation
    setLoading(true); // show loading
    setError(""); // clear previous error
    try {
      if (!form.title.trim()) throw new Error("Title is required"); // client-side validation: title required
      const payload = toPayload(form); // convert form to request payload

      const res = await fetch("/api/admin/movies", {
        method: "POST", // HTTP POST to create
        headers: { "Content-Type": "application/json" }, // JSON body
        body: JSON.stringify(payload) // serialize payload
      });

      if (!res.ok) {
        // try to surface server response for easier debugging
        const text = await res.text(); // read server response body as text
        throw new Error(`POST failed ${res.status}: ${text}`); // throw error with status and body
      }

      // success: clear form and refresh list
      setForm({ ...emptyForm }); // reset form to empty
      await load(); // refresh movies list from server
    } catch (err) {
      setError(err.message); // store error message for UI
    } finally {
      setLoading(false); // stop loading indicator
    }
  };

  /* Delete one movie by id (DELETE) */
  const deleteOne = async (id) => {
    if (!confirm("Delete this movie?")) return; // ask user to confirm; cancel if not confirmed
    setLoading(true); // show loading
    setError(""); // clear any error
    try {
      const res = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" }); // DELETE specific movie
      if (!res.ok) throw new Error(`DELETE ${id} failed: ${res.status}`); // error on bad status
      await load(); // refresh list after deletion
    } catch (err) {
      setError(err.message); // show error
    } finally {
      setLoading(false); // clear loading flag
    }
  };

  /* Delete all movies — issues parallel DELETEs for each movie */
  const deleteAll = async () => {
    if (!confirm("Delete ALL movies? This cannot be undone.")) return; // confirm destructive action
    setLoading(true); // set loading
    setError(""); // clear error
    try {
      const res = await fetch("/api/movies"); // first fetch list of movies
      if (!res.ok) throw new Error("Failed to load movies before deleting"); // fail early if can't list
      const list = await res.json(); // parse movie list

      // run deletes in parallel; failing deletes will still throw
      await Promise.all(list.map((m) => fetch(`/api/admin/movies/${m.id}`, { method: "DELETE" }))); // fire DELETE for each movie

      // refresh list after deletes
      await load(); // reload movies (should be empty if deletes succeeded)
    } catch (err) {
      setError(err.message); // report error
    } finally {
      setLoading(false); // clear loading
    }
  };

  /* Render UI */
  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial, sans-serif" }}>
      <h2>Admin — Movies (add • view • delete)</h2>

      {/* Add movie form */}
      <form onSubmit={addMovie} style={{ display: "grid", gap: 8, maxWidth: 720, marginBottom: 12 }}>
        {/* First row: title + director */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input name="title" placeholder="Title *" value={form.title} onChange={onChange} required /> {/* title input, controlled */}
          <input name="director" placeholder="Director" value={form.director} onChange={onChange} /> {/* director input */}
        </div>

        {/* Second row: genre + lead actor 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input name="genre" placeholder="Genre" value={form.genre} onChange={onChange} /> {/* genre input */}
          <input name="leadActor1" placeholder="Lead Actor 1" value={form.leadActor1} onChange={onChange} /> {/* lead actor 1 */}
        </div>

        {/* Third row: lead actor 2 + release date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input name="leadActor2" placeholder="Lead Actor 2" value={form.leadActor2} onChange={onChange} /> {/* lead actor 2 */}
          <input type="date" name="releaseDate" placeholder="Release Date" value={form.releaseDate} onChange={onChange} /> {/* date input */}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          <input
            name="posterUrl"
            placeholder="Poster URL"
            value={form.posterUrl}
            onChange={onChange}
          />
        </div>
        {/* Fourth Row: Synopsis */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          <input
            name="synopsis"
            placeholder="Movie Synopsis"
            value={form.synopsis}
            onChange={onChange}
          />
        </div>
        {/* Controls: sales, add, clear, delete all */}
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" step="0.01" name="salesMillions" placeholder="Sales (millions)" value={form.salesMillions} onChange={onChange} /> {/* numeric sales input */}
          <div style={{ flex: 1 }} /> {/* spacer to push buttons to the right */}
          <button type="submit" disabled={loading}>Add Movie</button> {/* submit button */}
          <button type="button" onClick={() => setForm({ ...emptyForm })} disabled={loading}>Clear</button> {/* clear form */}
          <button type="button" onClick={deleteAll} disabled={loading} style={{ marginLeft: 12, background: "#f44336", color: "#fff" }}>
            Delete All
          </button> {/* delete all button, styled red */}
        </div>
      </form>

      {/* Feedback */}
      {loading && <div>Working…</div>} {/* show working indicator when loading */}
      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>} {/* show error in crimson */}

      {/* Movies table */}
      <h3>Movies in DB ({movies.length})</h3> {/* show movie count */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 980 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Title</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Director</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Genre</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Lead 1</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Lead 2</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Release</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Sales ($M)</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Poster URL ($M)</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.id}</td>{/* movie id cell */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.title}</td>{/* title */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.director ?? ""}</td>{/* director or empty */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.genre ?? ""}</td>{/* genre or empty */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.leadActor1 ?? ""}</td>{/* lead actor 1 */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.leadActor2 ?? ""}</td>{/* lead actor 2 */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.releaseDate ?? ""}</td>{/* release date */}
                <td style={{ border: "1px solid #eee", padding: 8 }}>{m.salesMillions ?? ""}</td>{/* sales millions */}
                <td>
                {m.posterUrl ? (
                  <a href={m.posterUrl} target="_blank" rel="noopener noreferrer">View Poster</a>
                ) : (
                  "—"
                )}
                </td>
                {/* Actions: delete single movie */}
                <td style={{ border: "1px solid #eee", padding: 8, whiteSpace: "nowrap" }}>
                  <button onClick={() => deleteOne(m.id)} disabled={loading}>Delete</button> {/* delete button calls deleteOne */}
                </td>
              </tr>
            ))}

            {/* If there are no movies, show a friendly message row */}
            {movies.length === 0 && (
              <tr>
                <td colSpan="9" style={{ padding: 12, textAlign: "center" }}>No movies found</td>{/* fallback row when list empty */}
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* ------------------- USERS TABLE SECTION ------------------- */}
      <section style={{ marginTop: 24 }}>
        <h3>Administration — Users</h3>
        <UsersTable baseUrl="http://localhost:8080" />
      </section>

       {/* ------------------- REVIEWS TABLE SECTION ------------------- */}
       <section style={{ marginTop: 24 }}>
        <h3>Administration — Reviews</h3>
        <ReviewsTable baseUrl="http://localhost:8080" />
      </section>


      
    </div>
  );
}