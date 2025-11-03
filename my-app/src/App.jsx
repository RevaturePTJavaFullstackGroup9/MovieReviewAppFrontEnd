import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from 'react';
import Home from "./Home";
import AdminMovies from "./AdminMovies";
import MovieDetails from "./MovieDetails";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/LoginPage/SignupPage";
import JwtContext from "./components/Context/JwtContext";

/**
 * App entry with routing.
 * Maps the root path "/" to the Home component.
 * Add more routes as your app grows.
 */
export default function App() {
  // Create Contexts here
  const [jwt, setJwt] = React.useState(() => {
    return sessionStorage.getItem('jwt') ?? '';
  });
  const jwtContext = {jwt: jwt, setJwt: setJwt};
  
  React.useEffect(
    () => {
      sessionStorage.setItem('jwt', jwt);
    }, [jwt]
  ); 


  return (
    <JwtContext value={jwtContext}>
      <BrowserRouter>

        <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
          <Link to="/" style={{marginRight:12}}>Home</Link>
          <Link to="/admin">Admin</Link>
          <h5>{jwt}</h5>
        </nav>

          
        <Routes>
          {/* Homepage route */}
          <Route path="/" element={<Home />} />

          <Route path="/movies/:id" element={<MovieDetails />} />

          {/* Admin route */}
          <Route path="/admin" element={<AdminMovies />} />

          {/* Example: <Route path="/movies" element={<Movies />} /> */}
          <Route path="/movie_reviews/:movieId" element={<ReviewPage/>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>}/>

        </Routes>
      </BrowserRouter>
    </JwtContext>
  );
}
