import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to
        </h1>

        <Image
          src="/logo.png"
          alt="Read & Review Logo"
          width={200}
          height={200}
          priority
        />

        <p className={styles.subtitle}>
          Discover new books, share your opinions, and find your next great read through a community of readers like you.
        </p>

        <p><Link href="/pages/login" className={styles.button}>Start your journey</Link></p>
        <br/>
        <p>Don't have an account?</p>
        <p><Link href="/pages/register" className={styles.button}>Register here</Link></p>

      </main>
    </div>
  );
}
