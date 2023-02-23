import styles from "../styles/Aesh.module.css";
import { AiOutlineSave,AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Planning from "../components/Planning";
import {subtractTime,multiplyTime} from '../modules/time'
import { ExclamationCircleOutlined } from '@ant-design/icons';

function Aesh(props) {
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditable, setEditable] = useState(false);
const [prenom, setPrenom] = useState(props.Prénom);
const [heures, setHeures] = useState(props.Contrat);
console.log("newprops2",props.Prénom)
console.log("news props",prenom)

useEffect(() => {
  setPrenom(props.Prénom);
}, [props.Prénom])
useEffect(() => {
  setHeures(props.Contrat);
}, [props.Contrat])

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
    console.log("update",props._id,prenom,heures)
    try {
      const response = await fetch("http://localhost:3000/aeshs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aeshID: props._id,
          prenom: prenom,
          heures: heures,
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


let schedule = props.Planning;
let rates = {};
if (props.setting.length > 0) {
  rates = {
    Matin1: subtractTime(props.setting.Matin1.hEnd, props.setting.Matin1.hStart),
    Matin2: subtractTime(props.setting.Matin2.hEnd, props.setting.Matin2.hStart),
    Amidi1: subtractTime(props.setting.AMidi1.hEnd, props.setting.AMidi1.hStart),
    Amidi2: subtractTime(props.setting.AMidi2.hEnd, props.setting.AMidi2.hStart),
  };
}  
  let total = 0;

  for (let day in schedule) {
    for (let shift in schedule[day]) {
      if (schedule[day][shift] && rates[shift]) {
        let rateInMinutes = parseInt(rates[shift].split(":")[0]) * 60 + parseInt(rates[shift].split(":")[1]);
        total += rateInMinutes;
      }
    }
  }  
  let hours = Math.floor(total / 60);
  let minutes = total % 60;

  const heuresReals = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0')
  
  
  const diff = subtractTime(props.Contrat + ":00",heuresReals)




  return (
    <div className={styles.table}>
      <span className={styles.row1}>
        <AiOutlineUser />    <span
        contentEditable={isEditable}
        className={
          isEditable ? styles.prenomEditable : styles.prenomNotEditable
        }
        onBlur={(event) => setPrenom(event.target.innerText)}
      >
       {prenom}
      </span>
      </span>
      <span className={styles.row2}> <span
      contentEditable={isEditable}
      className={
        isEditable ? styles.heureEditable : styles.heureNotEditable
      }
      onBlur={(event) => setHeures(event.target.innerText)}
    >
      {heures}
    </span></span>
      <span className={styles.row3}>{heuresReals}</span>
      <div className={styles.row4}>
        <span>{diff}</span>
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
        <Planning key={props._id} onSave={props.onSave} hReals={heuresReals} diff={diff} Aesh={props}/>
      </Modal>
    </div>
  );
}

export default Aesh;
