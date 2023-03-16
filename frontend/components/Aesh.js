import styles from "../styles/Aesh.module.css";
import { AiOutlineSave,AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Button, Modal, Input, InputNumber } from "antd";
import Planning from "../components/Planning";
import {subtractTime,multiplyTime} from '../modules/time'
import { ExclamationCircleOutlined } from '@ant-design/icons';

function Aesh(props) {
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditable, setEditable] = useState(false);
const [prenom, setPrenom] = useState(props.Prénom);
const [contrat, setContrat] = useState(props.Contrat);
const [hours, setHours] = useState();
const [minutes, setMinutes] = useState();
const [heuresReels, setheuresReels] = useState(props.HeuresReels)

useEffect(() => {
  const [heureEnChiffres, minutesEnChiffres] = props.Contrat.split(":").map(Number);
  setHours(heureEnChiffres);
  setMinutes(minutesEnChiffres);
}, []);

useEffect(() => {
  setheuresReels(props.HeuresReels);
}, [props.HeuresReels]);

useEffect(() => {
  setPrenom(props.Prénom);
}, [props.Prénom])


const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: 'Voulez vous vraiment supprimer cette Aesh ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        deleteAesh()        
      },
      onCancel() {
        return    
      },
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const updateAesh = async () => { 

    if(!isEditable){
      return
    }
    try {
      const heureEnChiffres = hours.toString().padStart(2, "0")
      const minutesEnChiffres = minutes.toString().padStart(2, "0")
      console.log(heureEnChiffres)
      setContrat(heureEnChiffres + ':' + minutesEnChiffres)  
      const response = await fetch("http://localhost:3000/aeshs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aeshID: props._id,
          prenom: prenom,
          heures: heureEnChiffres + ':' + minutesEnChiffres,
        }),
      });
      const data = await response.json();
      console.log("thisdata",data);
      props.onSave();
    } catch (error) {
      console.error(error);
    }
  };

  
  const deleteAesh = async () => {
    try {
      const response = await fetch(`http://localhost:3000/aeshs/deleteone/${props._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      console.log(data)
      props.onSave();
     
   
    } catch (error) {
      console.error(error);
    }
  };   

  return (
    <div className={styles.table}>
      <span className={styles.row1}>
        <AiOutlineUser />   
        {isEditable ? (
          <Input
            value={prenom}
            className={styles.prenomEditable}
            onChange={(event) => setPrenom(event.target.value)}
            readOnly={!isEditable}
          />
        ) : (
          <span className={styles.prenomNotEditable}>{prenom}</span>
        )}
      </span>
      <span className={styles.row2}>
      
      {isEditable ? (
        <>
        <InputNumber className={styles.hour}   onChange={value => setHours(value)} min={0} max={50} defaultValue={hours}   />
        <span className={styles.doublepoint}> : </span> <InputNumber className={styles.hour} onChange={(value) => setMinutes(value)} min={0} max={45} step={15} defaultValue={minutes}  />
        </>
       
      ) : (


        <span>{contrat}</span>
      )}
     </span>
      <span className={styles.row3}>{heuresReels}</span>
      <div className={styles.row4}>
      <span className={styles.row6}>{subtractTime(contrat,heuresReels)}</span>
        <div className={styles.rightBtn}>
          <AiOutlineCalendar onClick={showModal} className={styles.calendar} />
          <span onClick={() => {
            setEditable(!isEditable);
            updateAesh();
          }} className={styles.edit}>
            {!isEditable && <AiOutlineEdit  className={styles.edit} />}
            {isEditable && <AiOutlineSave className={styles.delete} />}
          </span>
          <AiOutlineDelete  onClick={()=> {showDeleteConfirm()}} className={styles.delete} />
        </div>
      </div>

      <Modal 
        title={"Planning de " + props.Prénom}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        open={isModalOpen}
        width={900}
      >     
        <Planning key={props._id} onSave={props.onSave}   Aesh={props}/>
      </Modal>
    </div>
  );
}

export default Aesh;
