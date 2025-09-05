'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Form.module.css';
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                email,
                password,
            });

            console.log('Complete answer from the backend:', response.data);

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
        <div className={styles.wrapper}>
            <div className={styles.formContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Login URL da API (Debug): {process.env.NEXT_PUBLIC_API_URL || 'NÃO DEFINIDA'}</h1>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={styles.input}
                        required
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </Button>
                </form>

                <p className={styles.subtitle}>
                    Don't have an account?
                </p>

                <Link href="/register" className={styles.ctaButton}>
                    Register here
                </Link>
            </div>
        </div>
    );
}