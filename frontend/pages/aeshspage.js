import Aesh from '../components/Aesh';
import { AiOutlineUser } from "react-icons/ai";
import styles from '../styles/AeshParent.module.css'
import { useEffect, useState } from 'react';
import Planning from '../components/Planning';
import { Button, Tooltip, Modal } from 'antd';
import { UsergroupAddOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
function AeshPage() {

  const [dataAesh, setDataAesh] = useState([])
  const [settingData, setSettingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    fetchAesh()
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAesh = async () => {
    console.log("fetch again");
    try {
      const response = await fetch("http://localhost:3000/aeshs");
      const data = await response.json();
      setDataAesh(data)   
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
    
  
  useEffect(() => {
    fetchAesh()
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/settings/63e802d1b1152a2f4bda6ba1')
      .then(response => response.json())
      .then(data => {
        setSettingData(data.data);
      });
  }, []);

  const aeshs = dataAesh.map((data,i) => {
    return <Aesh setting={settingData} onSave={fetchAesh} key={i} {...data} />;
  });

  return (
    <div className={styles.container}>
    <Modal
    title={"Ajout d'un.e Aesh"}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={null}
    open={isModalOpen}
    width={900}
  > 
  <Planning newAesh="ok"  onSave={handleOk} />      
  </Modal>  
  <div className={styles.topBar}>
    <div className={styles.table}>
    <span className={styles.row1} > <AiOutlineUser /> Prénom :</span>
    <span className={styles.row2} >Contrat : </span>
    <span className={styles.row3} >Heures réelles :</span>
    <span className={styles.row4} >Différence :</span>
    <span className={styles.row5} ></span>
    </div>
    <div className={styles.add}><Tooltip title="Ajouter un Aesh">   
    
    <Button shape="circle" size="large" icon={<UsergroupAddOutlined onClick={showModal} />} />
    </Tooltip>
    </div>
    </div>

    {aeshs}
  
    </div>
  )
}

export default AeshPage;