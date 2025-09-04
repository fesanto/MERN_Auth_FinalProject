'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Form.module.css';
import Button from './Button';

export default function RegisterForm() {
    const [name, setName] = useState('');
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                name,
                email,
                password,
            });

            console.log('Registration successful:', response.data);

            router.push('/login');

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false); // Enables the button
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Register</h1>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className={styles.input}
                        required
                    />
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
                    <Button type="submit">
                        Register
                    </Button>
                </form>
            </div>
        </div>

    );
}