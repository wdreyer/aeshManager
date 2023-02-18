import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import Planning from './planning';
import Enfant from './Enfant';
import {getPlanningByAESH} from "../modules/planningfunction"
import {subtractTime,multiplyTime} from '../modules/time'


function Home() {
const[enfantData, setEnfantData] = useState ([]) ;
const[planning,setPlanning] = useState([]);
const [settingData, setSettingData] = useState([]);
const [dataAesh, setDataAesh] = useState([])

useEffect(() => {
  fetch('http://localhost:3000/settings')
    .then(response => response.json())
    .then(data => {

      
      setSettingData(data.data);
    });
}, []);
const rates = {};
if (settingData.length > 0) {
  rates.Matin1 = subtractTime(settingData[0].Matin1.hEnd, settingData[0].Matin1.hStart);
  rates.Matin2 = subtractTime(settingData[0].Matin2.hEnd, settingData[0].Matin2.hStart);
  rates.Amidi1 = subtractTime(settingData[0].AMidi1.hEnd, settingData[0].AMidi1.hStart);
  rates.Amidi2 = subtractTime(settingData[0].AMidi2.hEnd, settingData[0].AMidi2.hStart);
}


  
  useEffect(() => {
    fetch('http://localhost:3000/enfants')
      .then(response => response.json())
      .then(data => {
        setEnfantData(data.data.filter(e=>e._id !=="63ee549d4b6de7f8cedfcb46"));
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/aeshs')
      .then(response => response.json())
      .then(data => { 
        setDataAesh(data)         
     });
    }, [])

    useEffect(() => {
      enfantData.forEach((data) => {
        const childPlanning = getPlanningByAESH(dataAesh, data._id);

        setPlanning(planning => ({...planning, [data._id]: childPlanning}));

      });
    }, [dataAesh, enfantData]);

   
    const enfants = enfantData.map((data, i) => {
      const childPlanning = planning[data._id];

    
      return <Enfant key={i} rates={rates} planningChild={childPlanning} {...data} {...childPlanning} />;
    });


  return (
    <div className={styles.container}>
    <div className={styles.table}>
    <span className={styles.row1}><AiOutlineUser /> Prénom :</span>
    <span className={styles.row2}>Classe :</span>
    <span className={styles.row3}>Prof :</span>
    <span className={styles.row4}>Heures accordées : </span>
    <span className={styles.row5}>Heures réelles :</span>
    <span className={styles.row6}>Différence :</span>
    <span className={styles.row7}></span>
    </div>
    {enfants}    
    </div>
  );
}

export default Home;
