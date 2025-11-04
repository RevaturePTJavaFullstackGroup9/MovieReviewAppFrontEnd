import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const handleSubmit = (event, username, password, email, setSubmissionStatus, navigate) => {
    event.preventDefault();

    const signupRequestObject = {
        "username": username,
        "email": email,
        "password": password,
        "role": "USER"
    }

    /*
    const requestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(signupRequestObject)
    }
    
    fetch(`http://localhost:8080/api/auth/signup`, requestInit)
        .then(response => {
            if (!response.ok){
                throw new Error(`Error signing up, expected 200 status code, but recieved ${response.status}`);
            }
            return response.text();
        })
        .then(messageText => {
            console.log(`Succesfully signed up! Server Response= "${messageText}"`)
            setSubmissionStatus("SUCCESS")
        })
        .catch(err => {
            console.error(`Unable to sign up due to error:"${err}"`)
            setSubmissionStatus("FAIL")
        });
    */
    axios.post(`http://localhost:8080/api/auth/signup`, signupRequestObject)
        .then(
            response => {
                if (response.status != 200){
                    throw new Error(`Error signing up, expected 200 status code, but recieved ${response.status}`);
                }
                console.log(`Succesfully signed up! Server Response= "${response.data.message}", Status=${response.status}`)
                setSubmissionStatus("SUCCESS")
                setTimeout( () => {
                    navigate("/login")
                }, 3000)
            }
        )
        .catch(error => {
            if (error.response){
                console.error(`Server responded with an error. Raw Data=${JSON.stringify(error.response.data)}, status code: ${error.response.status}`)
            }
            else if (error.request){
                console.error(`No response received from server!`)
            }
            else{
                console.error(`Unexpected error occorued during signup, error="${error}"`)
            }
            
            setSubmissionStatus("FAIL")
        })
};

const LoginMessageDisplay = (submissionStatus) => {
    if (submissionStatus === "SUCCESS"){
        return (<>
            <h3> Sucessfully Registered!</h3>
            <h4> Now rerouting to the login page...</h4>
        </>)
    }
    else if (submissionStatus === "FAIL"){
        return (<>
            <h3> Unable to Register...</h3>
            <h4> Please double check your username and email and try again later...</h4>
        </>
        )
    }

    return (
        <></>
    )
};

const SignupPage = () =>{
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [submissionStatus, setSubmissionStatus] = React.useState('PENDING');
    const navigate = useNavigate();

    return (<>
        <form onSubmit={e => handleSubmit(e, username, password, email, setSubmissionStatus, navigate)}>
            <label htmlFor='usernameInput'>Username:</label>
            <input id="usernameInput" type='text' value={username} onChange={e => setUsername(e.target.value)} /><br/>
            <label htmlFor='passwordInput'>Password:</label>
            <input id="passwordInput" type='password' value={password} onChange={e => setPassword(e.target.value)}/><br/>
            <label htmlFor='emailInput'>Email:</label>
            <input id="emailInput" value={email} onChange={e => setEmail(e.target.value)} /><br/>
            <button type="submit" disabled={submissionStatus==="SUCCESS"}>Register</button>            
        </form>
        {LoginMessageDisplay(submissionStatus)}

    </>)
};

export default SignupPage;