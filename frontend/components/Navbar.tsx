import Link from 'next/link';
import styles from './Navbar.module.css';
export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>Book Finder</Link>
            <div className={styles.links}>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
            </div>
        </nav>
    );
}
