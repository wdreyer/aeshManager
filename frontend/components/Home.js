import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import Planning from './Planning';
import Enfant from './Enfant';
import {getPlanningByAESH} from "../modules/planningfunction"
import {subtractTime,multiplyTime} from '../modules/time'
import { UsergroupAddOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

function Home() {
const[enfantData, setEnfantData] = useState ([]) ;
const[planning,setPlanning] = useState([]);
const [settingData, setSettingData] = useState([]);
const [rates, setRates] = useState({});
const [dataAesh, setDataAesh] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);

const showModal = () => {
  setIsModalOpen(true);
};
const handleOk = () => {
  setIsModalOpen(false);
};
const handleCancel = () => {
  setIsModalOpen(false);
};

useEffect(() => {
  fetch("http://localhost:3000/settings/63e802d1b1152a2f4bda6ba1")
    .then((response) => response.json())
    .then((data) => {
      setSettingData(data.data);     
    });
}, []);

useEffect(() => {
if (settingData.AMidi1) {

  let intRates = {}
  intRates.Matin1 = subtractTime(settingData.Matin1.hEnd, settingData.Matin1.hStart);
  intRates.Matin2 = subtractTime(settingData.Matin2.hEnd, settingData.Matin2.hStart);
  intRates.Amidi1 = subtractTime(settingData.AMidi1.hEnd, settingData.AMidi1.hStart);
  intRates.Amidi2 = subtractTime(settingData.AMidi2.hEnd, settingData.AMidi2.hStart);
  setRates(intRates)
}

}, [settingData]);
  
  useEffect(() => {
    fetch("http://localhost:3000/enfants")
      .then((response) => response.json())
      .then((data) => {
        setEnfantData(data.data.filter((e) => e._id !== "63ee549d4b6de7f8cedfcb46"));
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/aeshs")
      .then((response) => response.json())
      .then((data) => {
        setDataAesh(data);
      });
  }, []);

  useEffect(() => {
    enfantData.forEach((data) => {
      const childPlanning = getPlanningByAESH(dataAesh, data._id);

      setPlanning((planning) => ({ ...planning, [data._id]: childPlanning }));
    });
  }, [dataAesh, enfantData]);

  const enfants = enfantData.map((data, i) => {
    const childPlanning = planning[data._id];
    return <Enfant key={i} rates={rates} planningChild={childPlanning} {...data} {...childPlanning} />;
  });


  return (
    <div className={styles.container}>
    <Modal
    title={"Ajout d'un enfant"}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={null}
    open={isModalOpen}
    width={900}
  > 
  <Planning newChild="ok" onSave={handleOk} />      
  </Modal>  
    <div className={styles.topBar}>
    <div className={styles.table}>
    <span className={styles.row1}><AiOutlineUser /> Prénom :</span>
    <span className={styles.row2}>Classe :</span>
    <span className={styles.row3}>Prof :</span>
    <span className={styles.row4}>Heures accordées : </span>
    <span className={styles.row5}>Heures réelles :</span>
    <span className={styles.row6}>Différence :</span>
    <span className={styles.row7}></span>
    </div>
    <div className={styles.add}><Tooltip title="Ajouter un enfant">   
    
    <Button shape="circle" size="large" icon={<UsergroupAddOutlined onClick={showModal} />} />
    </Tooltip></div>
    </div> 
    {enfants}    
    </div>
  );
}

export default Home;
