import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import Loader from './Loader';
import Meta from '../utils/Meta';
import { app } from '../firebase';

const OAuthGoogle = () => {

    const auth = getAuth(app);

    const handleGoogleClick = async() =>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: "Select_account"});

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            console.log(resultFromGoogle);
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div>
      <button type="button" onClick={handleGoogleClick} >
      Continue with Google</button>
    </div>

    
  )
}

export default OAuthGoogle
