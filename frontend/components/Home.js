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
  fetchEnfants()
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

const fetchEnfants = async () => {
  console.log("are you refetching ?")
  try {
    const response = await fetch("http://localhost:3000/enfants");
    const data = await response.json();
    // setEnfantData(data.data.filter((e) => e._id !== "63ee549d4b6de7f8cedfcb46"));
   
    const sortedEnfantData = data.data.filter((e) => e._id !== "63ee549d4b6de7f8cedfcb46").sort((a, b) => {
      const classes = ["CP", "CE1", "CE2", "CM1", "CM2", "Ulyss"];
      const aClassIndex = classes.indexOf(a.Classe);
      const bClassIndex = classes.indexOf(b.Classe);
      return aClassIndex - bClassIndex;
    });
    setEnfantData(sortedEnfantData);
    console.log("fetching",data)
  } catch (error) {
    console.error(error);
  }
};
  
  useEffect(() => {
    fetchEnfants()
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/aeshs")
      .then((response) => response.json())
      .then((data) => {
        setDataAesh(data);
      });
  }, []);

  const enfants = enfantData.map((data, i) => {
    const childPlanning = planning[data._id];
    return <Enfant key={i} rates={rates} planningChild={childPlanning} onSave={fetchEnfants}  {...data} {...childPlanning} />;
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
  <Planning newChild="ok"  onSave={handleOk} />      
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
    {enfants }    
    </div>
  );
}

export default Home;
