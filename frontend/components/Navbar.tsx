'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // It checks the login status whenever the route changes
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>Read & Review</Link>
            <div className={styles.links}>
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/profile">My Profile</Link>
                        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
