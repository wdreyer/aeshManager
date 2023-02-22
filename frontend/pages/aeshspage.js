import Aesh from '../components/Aesh';
import { AiOutlineUser } from "react-icons/ai";
import styles from '../styles/AeshParent.module.css'
import { useEffect, useState } from 'react';
function AeshPage() {

  const [dataAesh, setDataAesh] = useState([])
  const [settingData, setSettingData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/aeshs')
      .then(response => response.json())
      .then(data => { 
        setDataAesh(data)

      });
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/settings/63e802d1b1152a2f4bda6ba1')
      .then(response => response.json())
      .then(data => {
        setSettingData(data.data);
      });
  }, []);

  const aeshs = dataAesh.map((data, i) => {
    return <Aesh setting={settingData} key={i} {...data}  />;
  }); 

  return (
    <div className={styles.container}>
    <div className={styles.table}>
    <span className={styles.row1} > <AiOutlineUser /> Prénom :</span>
    <span className={styles.row2} >Contrat : </span>
    <span className={styles.row3} >Heures réelles :</span>
    <span className={styles.row4} >Différence :</span>
    <span className={styles.row5} ></span>
    </div>

    {aeshs}
  
    </div>
  )
}

export default AeshPage;