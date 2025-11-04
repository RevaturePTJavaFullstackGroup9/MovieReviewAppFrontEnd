import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import JwtContext from '../Context/JwtContext';
import UserContext from '../Context/UserContext';

const handleSubmit = (event, username, password, setSubmissionStatus, setJwt, navigate, setUser) => {
    event.preventDefault();

    const loginRequest = {
        "username": username,
        "password": password
    };

    axios.post("http://localhost:8080/api/auth/login", loginRequest)
        .then(
            response => {
                console.log(`Succesfully logged in! Response= ${JSON.stringify(response.data)}`)
                // Set Auth Token Globally here
                setJwt(response.data.token);
                console.log(response.data);
                const user = {
                    id: response.data.id,
                    email: response.data.email,
                    token: response.data.token,
                    username: response.data.username,
                };
                setUser(user);
                setSubmissionStatus("SUCCESS");
                setTimeout( () => {navigate("/")}, 3000);
            }
        )
        .catch(
            error => {
                if (error.response){
                    console.error(`Server responded with an error. Raw Data=${JSON.stringify(error.response.data)}, status code: ${error.response.status}`)
                }
                else if (error.request){
                    console.error(`No response received from server!`)
                }
                else{
                    console.error(`Unexpected error occured during signin, error="${error}"`)
                }
            
                setSubmissionStatus("FAIL")
            }
        )
};

const LoginMessageDisplay = (submissionStatus, jwt) => {
    if (submissionStatus === "SUCCESS"){
        return (<>
            <h3> Sucessfully Login!</h3>
            <h4> Now rerouting to the main page...</h4>
        </>)
    }
    else if (submissionStatus === "FAIL"){
        return (<>
            <h3> Unable to Login...</h3>
            <h4> Please double check your username and password and try again later...</h4>
        </>
        )
    }

    return (
        <></>
    )
};

const LoginPage = () => {
    
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [submissionStatus, setSubmissionStatus] = React.useState('PENDING');
    const {jwt, setJwt} = React.useContext(JwtContext);
    const {user, setUser} = React.useContext(UserContext);
    const navigate = useNavigate();

    return (<>
        <form onSubmit={e => handleSubmit(e, username, password, setSubmissionStatus, setJwt, navigate, setUser)}>
            <label htmlFor='usernameInput'>Username:</label>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} /><br/>
            <label htmlFor='passwordInput'>Password:</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}/><br/>
            <button type="submit">Login</button>            
        </form>
        {LoginMessageDisplay(submissionStatus, jwt)}
        <h3>Not yet registered?</h3>
        <h5>Please click  <a href='/signup'>here</a></h5>

    </>)
};

export default LoginPage;