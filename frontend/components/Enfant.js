 import styles from "../styles/Enfant.module.css";
 import { Button, Modal } from "antd";
 import Planning from "../components/Planning";
 import {getPlanningByAESH} from "../modules/planningfunction"
 import {subtractTime,multiplyTime} from '../modules/time'


 import { AiOutlineSave,AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";

import { useState } from "react";

function Enfant(props) {


   const schedule = props.Planning;
   const rates = props.rates;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [prenom, setPrenom] = useState(props.Prénom);
  const [heures, setHeures] = useState(props.Heures);
  const [dataAesh, setDataAesh] = useState([]);

  //fonction pour afficher la modale :
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // fin de la fonction

  //function heures

  let total = 0;

  for (let day in schedule) {
    for (let shift in schedule[day]) {
      if (schedule[day][shift].Prénom !== "" ) {
        let rateInMinutes = parseInt(rates[shift].split(":")[0]) * 60 + parseInt(rates[shift].split(":")[1]);
        total += rateInMinutes;
       
      }
    }
  }  
  let hours = Math.floor(total / 60);
  let minutes = total % 60;

  const heuresReals = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0')
  
  
  const diff = subtractTime(heures + ":00",heuresReals)

  //end function heures




  //fonction pour update un enfant :
  const updateEnfant = async () => { 
    try {
      const response = await fetch("http://localhost:3000/enfants/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID: props._id,
          prenom: prenom,
          heures: heures,
          classe: props.Classe,
          prof: props.Prof,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // fin de la fonction 

  return (
    <>
      <div id={props._id} className={styles.table}>
      <div className={styles.row1} >   
      <AiOutlineUser />
          <span
            contentEditable={isEditable}
            className={
              isEditable ? styles.prenomEditable : styles.prenomNotEditable
            }
            onBlur={(event) => setPrenom(event.target.innerText)}
          >
           {prenom}
          </span>
          </div>
          <span className={styles.row2}>CP</span>
          <span className={styles.row3}>{props.Prof}</span>      
          <div className={styles.row4}>
          <span
              contentEditable={isEditable}
              className={
                isEditable ? styles.heureEditable : styles.heureNotEditable
              }
              onBlur={(event) => setHeures(event.target.innerText)}
            >
              {heures}
            </span>
          </div>
          <span className={styles.row5}>{heuresReals}</span>
          <span className={styles.row6}>{diff}</span>
          
          <div className={styles.rightBtn}>
          <AiOutlineCalendar onClick={showModal} className={styles.calendar} />
          <span onClick={() => {
            setEditable(!isEditable);
            updateEnfant();
          }} className={styles.edit}>
            {!isEditable && <AiOutlineEdit  className={styles.edit} />}
            {isEditable && <AiOutlineSave className={styles.delete} />}
          </span>
            <span className={styles.delete}>
              <AiOutlineDelete />
            </span>
          </div>
          <Modal
          title={"Planning de " +  prenom}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          open={isModalOpen}
          width={900}
        > 
        <Planning id={props._id} heurresReals={heuresReals} diff={diff} prenom ={prenom} child={props} planningChild={props.planningChild}/>      
        </Modal>       
      </div>
    </>
  );
}

export default Enfant;
