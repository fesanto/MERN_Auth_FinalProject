import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <p className={styles.welcomeText}>Welcome to</p>

          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="Read & Review Logo"
              width={200}
              height={200}
              priority
            />
          </div>

          <p className={styles.subtitle}>
            Discover new books, share your opinions, and find your next great read through a community of readers like you.
          </p>

          <Link href="/login" className={styles.ctaButton}>
            Start your journey
          </Link>

          <p className={styles.subtitle}>
            Don't have an account?
          </p>

          <Link href="/register" className={styles.ctaButton}>
            Register here
          </Link>
        </div>
      </main>
    </div>
  );
}
