import styles from '../styles/Menu.module.css';
import Link from 'next/link';

function Menu() {
 
  return (
    <div className={styles.header}>
      <span className={styles.logo}>AESH Manager</span>
      <div className={styles.linkContainer}>
        <Link href='/'><a className={styles.link}>Accueil</a></Link>
        <Link  href='/classes'><a className={styles.link}>Classes</a></Link>
        <Link href='/aeshspage'><a className={styles.link}>AESH</a></Link>
        <Link   href='/réglages'><a className={styles.link}>Réglages</a></Link>
    </div>
    </div>
  );
}

export default Menu;

