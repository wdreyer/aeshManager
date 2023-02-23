 import styles from "../styles/Enfant.module.css";
 import { Select, Input,Button, Modal, Space } from 'antd';
 import Planning from "../components/Planning";
 import {subtractTime,multiplyTime} from '../modules/time'
 import { ExclamationCircleOutlined } from '@ant-design/icons';
 import {  useSelector } from 'react-redux';
 import { AiOutlineSave,AiOutlineUser, AiOutlineEdit, AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";
import { useState,useEffect } from "react";

function Enfant(props) {
   const schedule = props.Planning;
   const rates = props.rates;
   const { confirm } = Modal;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [prenom, setPrenom] = useState(props.Prénom);
  const [heures, setHeures] = useState(props.Heures);
  const [heuresReels, setheuresReels] = useState(props.HeuresReels)
  const [dataAesh, setDataAesh] = useState([]);
  const settings = useSelector((state) => state.users.settings);
  const classes = settings.Classes;  


function getClass(classe) {
  switch (classe) {
    case "CP":
      return styles.cp;
    case "CE1":
      return styles.ce1;
    case "CE2":
      return styles.ce2;
    case "CM1":
      return styles.cm1;
    case "CM2":
      return styles.cm2;
    case "Ulyss":
      return styles.ulyss;
    default:
      return "";
  }
}
  
    useEffect(() => {
    setheuresReels(props.HeuresReels);
  }, [props.HeuresReels]);

  const [selectedCategory, setSelectedCategory] = useState(props.Classe);
  const [selectedValue, setSelectedValue] = useState(props.Prof);


  


  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedValue("");
  };
  
  const handleValueChange = (value) => {
    setSelectedValue(value);
  };


  const categoryOptions = classes.map((category) => {
    const categoryName = Object.keys(category)[0];
    return {
      value: categoryName,
      label: categoryName,
    };
  });

  const selectedCategoryValues =
    selectedCategory !== ""
      ? classes.find((category) => Object.keys(category)[0] === selectedCategory)?.[selectedCategory] || []
      : [];

  const valueOptions =
    selectedCategoryValues.length > 0
      ? selectedCategoryValues.map((value) => {
          return {
            value: value,
            label: value,
          };
        })
      : [];
      

  const showDeleteConfirm = () => {
    confirm({
      title: 'Voulez vous vraiment supprimer cet enfant ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        deleteEnfant()        
      },
      onCancel() {
        return    
      },
    });
  };

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
          classe: selectedCategory ,
          prof: selectedValue,
        }),
      });
      const data = await response.json();
      console.log(data);
      props.onSave();
    } catch (error) {
      console.error(error);
    }
  };
  // fin de la fonction 

  //fonction pour supprimer un enfant :

  const deleteEnfant = async () => {
    try {
      const response = await fetch(`http://localhost:3000/enfants/deleteone/${props._id}`, {
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
    <>
      <div id={props._id} className={`${styles.table} ${getClass(props.Classe)}`}>
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


          {isEditable ? (
            <>
           <span className={styles.row2}>
              <Select
                defaultValue={{
                  value: selectedCategory,
                  label: selectedCategory,
                }}
                style={{ width: 80 }}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Select a category"
              />
            </span>
            <span className={styles.row3}>
              <Select
                defaultValue={{
                  value: selectedValue,
                  label: selectedValue,
                }}
                style={{ width: 120 }}
                value={selectedValue}
                onChange={handleValueChange}
                options={valueOptions}
                placeholder="Select a value"
              />
              </span>
            </>
          ) : (
            <>
              <span className={styles.row2}>{props.Classe}</span>
              <span className={styles.row3}>{props.Prof}</span>
            </>
          )}

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
          <span className={styles.row5}>{heuresReels}</span>
          <span className={styles.row6}>{subtractTime(heuresReels,heures)}</span>
          
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
              <AiOutlineDelete onClick={()=> {showDeleteConfirm()}} />
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
        <Planning id={props._id} heuresReels={heuresReels} diff={subtractTime(heuresReels,heures)} prenom={prenom} child={props} onSave={props.onSave} planningChild={props.planningChild}/>      
        </Modal>       
      </div>
    </>
  );
}

export default Enfant;
