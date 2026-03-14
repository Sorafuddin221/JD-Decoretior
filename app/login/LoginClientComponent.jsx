'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/Form.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '@/features/user/userSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { toast } from 'react-toastify';


function LoginClientComponent() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { error, loading, success, isAuthenticated } = useSelector(state => state.user);

    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email: loginEmail, password: loginPassword, rememberMe }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, router, redirect]);

    useEffect(() => {
        if (success) {
            toast.success('Welcome back! You have successfully signed in.', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(clearCart());
        }
    }, [dispatch, success]);

    return (
        <div className='form-container'>
            <div className="form-content">
                <form className="form" onSubmit={loginSubmit}>
                    <h2>Sign In</h2>
                    <div className="input-group">
                        <input type="email" placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoComplete="email" />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder='Password' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} autoComplete="current-password" />
                    </div>
                    <div className="input-group remember-me-group">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div>
                    <button className="authBtn" type="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="form-links">Forgot your Password<Link href="/password/forgot">Reset here</Link></p>
                    <p className="form-links">Don't have an account?<Link href="/register">Sign up here</Link></p>
                </form>
            </div>
        </div>
    );
}

export default LoginClientComponent;