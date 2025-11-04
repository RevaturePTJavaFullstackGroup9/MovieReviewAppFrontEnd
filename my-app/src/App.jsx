import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from 'react';
import Home from "./Home";
import AdminMovies from "./AdminMovies";
import MovieDetails from "./MovieDetails";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import Register from "./Register";
import Login from "./Login";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/LoginPage/SignupPage";
import JwtContext from "./components/Context/JwtContext";
import UserContext from "./components/Context/UserContext";
import LogoutPage from "./components/LogoutPage/LogoutPage";

/**
 * App entry with routing.
 * Maps the root path "/" to the Home component.
 * Add more routes as your app grows.
 */
export default function App() {
  // Create Contexts here
  const [jwt, setJwt] = React.useState(() => {
    return localStorage.getItem('jwt') ?? '';
  });
  const jwtContext = {jwt: jwt, setJwt: setJwt};

  const [user, setUser] = React.useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      return storedUser
    }
    catch (e){
      return null;
    }
  })
  const userContext = {user: user, setUser: setUser};

  React.useEffect(
    () => {
      localStorage.setItem('jwt', jwt);
    }, [jwt]
  ); 

  React.useEffect (
    () => {
      localStorage.setItem('user', JSON.stringify(user))
    }, 
    [user]
  )


  return (
    <JwtContext value={jwtContext}>
      <UserContext value={userContext}>
      <BrowserRouter>

        <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
          <Link to="/" style={{marginRight:12}}>Home</Link>

          <Link to="/register" style={{ marginRight: 12 }}>Register</Link>

          <Link to="/login" style={{ marginRight: 12 }}>Login</Link>

          {user?.role?.includes('ADMIN') ? <Link to="/admin" style={{marginRight:12}}>Admin</Link> : <></>}
          {user ? <Link to="/logout">Logout</Link> : <></> }
          <h5>{user ? `Welcome, ${user.username}` : "Not Logged In"}</h5>

        </nav>

          
        <Routes>
          {/* Homepage route */}
          <Route path="/" element={<Home />} />

          <Route path="/movies/:id" element={<MovieDetails />} />

          {/* Admin route */}
          <Route path="/admin" element={<AdminMovies />} />

          {/* Example: <Route path="/movies" element={<Movies />} /> */}
          <Route path="/movie_reviews/:movieId" element={<ReviewPage/>} />

          {/* 
          <Route path="/login" element={<LoginPage />} />
          */}
          <Route path="/signup" element={<SignupPage/>}/>

          <Route path="/logout" element={<LogoutPage/>}/>



        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      </UserContext>
    </JwtContext>

  );
}
