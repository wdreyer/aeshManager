import styles from "../styles/Settings.module.css";
import { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { Select } from 'antd';



export default function Setting() {
const [settingData, setSettingData] = useState([]);
const settings = useSelector((state) => state.users.settings);
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
      <div className={styles.classes}>Classes :</div>
      {displayclasses}
    </div>
  );
}