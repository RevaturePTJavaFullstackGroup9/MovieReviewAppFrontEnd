import React from 'react';

const JwtContext = React.createContext({jwt: null, setJwt: ()=>{}});
export default JwtContext;