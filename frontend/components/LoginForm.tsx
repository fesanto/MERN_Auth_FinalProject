'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to control loading
    const router = useRouter(); // Initializes the router

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Disables the button when starting the upload

        try {
            // 1. Request login
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            // 2. SUCCESS! Store the received token in localStorage
            localStorage.setItem('authToken', response.data.token);

            console.log('Login successful! Token saved.');

            // 3. Redirect to the dashbord page
            router.push('/dashboard');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false); // Enables the button
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
        </form>
    );
}