import styles from "../styles/Settings.module.css";
import { useEffect, useState } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import { Select } from 'antd';
import {setSettings } from '../reducers/users'

export default function Setting() {
  const dispatch = useDispatch();  

  const [settings, setsettings] = useState({
    Matin1: { hStart: '', hEnd: '' },
    Matin2: { hStart: '', hEnd: '' },
    AMidi1: { hStart: '', hEnd: '' },
    AMidi2: { hStart: '', hEnd: '' },
  });

  useEffect(() => {
    fetch('http://localhost:3000/settings/63e802d1b1152a2f4bda6ba1')
      .then(response => response.json())
      .then(data => {
        dispatch(setSettings(data.data));
        setsettings(data.data);
      });
  }, []);


const classes = settings.Classes;

  let displayclasses = null;
  if (classes) {
    displayclasses = classes.map((category) => {
      const categoryName = Object.keys(category)[0];
      const categoryValues = category[categoryName];

      return (
        <>
          <div className={styles.classes}>{categoryName + " : "}
          <div className={styles.classesContainer}>
            {categoryValues.map((value) => (
              <div className={styles.classesSmall} key={value}>{value}</div>
            ))}
          </div>
          </div>
          </>
      
      );
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <span key="Ecole">Ecole :</span>
        <span key="ecole-valeur">{settings.Ecole}</span>
      </div>   
      <div className={styles.table}>
      <span key="User">Nom utilisateur :</span>
      <span key="ecole-valeur">{settings.username}</span>
    </div>
    <div className={styles.contentH}>
    <span>Plages horaires :</span>
    <div className={styles.horaires}>
      <div className={styles.columnHeader}>
        <span></span>
        <span>Matin 1</span>
        <span>Matin 2</span>
        <span>A-Midi 1</span>
        <span>A-Midi 2</span>
      </div>
      <div className={styles.rowHoraires}>
        <span>Début</span>
        <span>{settings.Matin1.hStart}</span>
        <span>{settings.Matin2.hStart}</span>
        <span>{settings.AMidi1.hStart}</span>
        <span>{settings.AMidi2.hStart}</span>
      </div>
      <div className={styles.rowHoraires}>
        <span>Fin</span>
        <span>{settings.Matin1.hEnd}</span>
        <span>{settings.Matin2.hEnd}</span>
        <span>{settings.AMidi1.hEnd}</span>
        <span>{settings.AMidi2.hEnd}</span>
      </div>
    </div>

  </div>
      <div className={styles.classes}>Classes :</div>
      {displayclasses}
    </div>
  );
}