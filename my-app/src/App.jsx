import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import AdminMovies from "./AdminMovies";
import MovieDetails from "./MovieDetails";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import Register from "./Register";

/**
 * App entry with routing.
 * Maps the root path "/" to the Home component.
 * Add more routes as your app grows.
 */
export default function App() {
  return (
    <BrowserRouter>

      <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
          <Link to="/" style={{marginRight:12}}>Home</Link>
          <Link to="/admin">Admin</Link>
           <Link to="/register">Register</Link>
        </nav>

        
      <Routes>
        {/* Homepage route */}
        <Route path="/" element={<Home />} />

        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* Admin route */}
        <Route path="/admin" element={<AdminMovies />} />

        {/* Example: <Route path="/movies" element={<Movies />} /> */}
        <Route path="/movie_reviews/:movieId" element={<ReviewPage/>} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}
