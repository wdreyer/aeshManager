import styles from "../styles/Aesh.module.css";
import { AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Planning from "../components/Planning";
import {subtractTime,multiplyTime} from '../modules/time'


function Aesh(props) {
const [isModalOpen, setIsModalOpen] = useState(false);


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


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.table}>
      <span className={styles.row1}>
        <AiOutlineUser /> {props.Prénom}
      </span>
      <span className={styles.row2}>{props.Contrat}</span>
      <span className={styles.row3}>{heuresReals}</span>
      <div className={styles.row4}>
        <span>{diff}</span>
        <div className={styles.rightBtn}>
          <AiOutlineCalendar onClick={showModal} className={styles.calendar} />
          <AiOutlineEdit className={styles.edit} />
          <AiOutlineDelete className={styles.delete} />
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
        <Planning key={props._id} hReals={heuresReals} diff={diff} Aesh={props}/>
      </Modal>
    </div>
  );
}

export default Aesh;
