import React from 'react';

import JwtContext from '../Context/JwtContext';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    
    const {setJwt} = React.useContext(JwtContext);
    //const {setUser} = React.useContext(UserContext);
    const navigate = useNavigate();


    React.useEffect(()=>{
        setUser(null);
        //setJwt('');
        setTimeout(()=>{navigate("/")}, 3000)
    }, []);
    
    return (<>
        <h2>Now logging you out...</h2>
        <h2>Returning to the home page in 3 seconds...</h2>
    </>)
};

export default LogoutPage;