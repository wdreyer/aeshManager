import styles from '../styles/Menu.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {setSettings } from '../reducers/users'

function Menu() {
  const dispatch = useDispatch();  
  useEffect(() => {
    fetch('http://localhost:3000/settings/63e802d1b1152a2f4bda6ba1')
      .then(response => response.json())
      .then(data => {     
          dispatch(setSettings(data.data))           
      });
  }, []);


  
 
 
  return (
    <div className={styles.header}>
      <span className={styles.logo}>AESH Manager</span>
      <div className={styles.linkContainer}>
        <Link href='/'><a className={styles.link}>Accueil</a></Link>
        <Link  href='/classes'><a className={styles.link}>Classes</a></Link>
        <Link href='/aeshspage'><a className={styles.link}>AESH</a></Link>
        <Link   href='/settings'><a className={styles.link}>Réglages</a></Link>
    </div>
    </div>
  );
}

export default Menu;

