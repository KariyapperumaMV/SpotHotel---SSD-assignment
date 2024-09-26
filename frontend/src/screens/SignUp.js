import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAction } from '../redux/actions/userAction';
import Loader from '../components/Loader';
import Meta from '../utils/Meta';
import { GoogleLogin } from 'react-google-login'; 

const SignUp = () => {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading } = useSelector((state) => state.userState);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate])

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    };

    const responseGoogle = (response) => {
        const { profileObj } = response;
        const googleUser = {
            name: profileObj.name,
            email: profileObj.email,
            googleId: profileObj.googleId // Adjust based on your backend expectations
        };
        // Dispatch action to handle Google sign-up or login
        dispatch(signUpAction(googleUser));
    };

    const signupHandler = () => {
        const newErrors = {};

        if (!validateUsername(name)) {
            newErrors.name = "Username can only contain letters and numbers.";
        }
        if (!validatePassword(password)) {
            newErrors.password = "Password must be at least 8 characters, include uppercase, lowercase, numbers, and special characters.";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (Object.keys(newErrors).length === 0) {
            // Dispatch signup action if no errors
            dispatch(signUpAction({ name, email, password }));
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <Fragment>
            <Meta title="Sign Up" />
            <Fragment>
                {isLoading ? <Loader /> : (
                    <div className="mx-auto px-4 md:px-10 lg:px-20 xl:px-48 mt-4">
                        <h2 className="text-center text-4xl font-semibold text-gray-800">Create New Account</h2>
                        <div className="flex flex-col items-center mt-12">
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" required className="bg-stone-50 w-full sm:w-2/4 md:w-2/3 lg:w-1/3  p-3 border border-solid border-slate-900 focus:outline-none rounded" />
                            {errors.name && <p className="text-red-600">{errors.name}</p>}

                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required className="bg-stone-50 w-full sm:w-2/4 md:w-2/3 lg:w-1/3  p-3 border border-solid border-slate-900 focus:outline-none rounded mt-6" />

                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="bg-stone-50 w-full sm:w-2/4 md:w-2/3 lg:w-1/3  p-3 border border-solid border-slate-900 rounded mt-6" />
                            {errors.password && <p className="text-red-600">{errors.password}</p>}

                            <div className="bg-stone-50 w-full sm:w-2/4 md:w-2/3 lg:w-1/3  p-3 border border-solid border-slate-900 rounded mt-6 flex justify-between">
                                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={isPasswordHidden ? "password" : "text"} placeholder="Confirm password" required className="focus:outline-none w-3/4 bg-transparent" />
                                <VisibilityIcon className={`cursor-pointer ${isPasswordHidden ? "text-red-400" : "text-red-800"}`} onClick={() => setIsPasswordHidden(!isPasswordHidden)} />
                            </div>
                            {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}

                            <p className="mt-5 w-full sm:w-2/4 md:w-2/3 lg:w-1/3 text-center">By signing up, I agree to the Hotels <button className="text-blue-500">Terms and Conditions </button> and <button className="text-blue-500">Privacy Statement</button>.</p>
                            <button onClick={signupHandler} type="button" className=" mt-12 p-3 w-2/3 sm:w-2/4 md:w-1/3 lg:w-1/5 text-white rounded-3xl hover:bg-blue-900 bg-blue-700 disabled:bg-blue-500" disabled={email.length < 1 || password.length < 8 || password !== confirmPassword || name.length < 1}>Sign Up</button>

                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                buttonText="Sign up with Google"
                                onSuccess={responseGoogle}
                                onFailure={(error) => console.error('Login failed:', error)}
                                cookiePolicy={'single_host_origin'}
                            />
                            <p className="mt-4">Already have an account? <Link to="/login" className="text-blue-700" >Sign in</Link></p>
                        </div>
                    </div>
                )}
            </Fragment>
        </Fragment>
    )
}

export default SignUp;
