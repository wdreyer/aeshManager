import Planning from "../components/Planning";
import { useState, useEffect } from "react";
import {  useSelector } from 'react-redux';
import styles from '../styles/Classes.module.css'



function Classe () {
const[enfantData, setEnfantData] = useState ([]) ;
const [selectedClasses, setSelectedClasses] = useState([]);
const [classOrder,setClassOrder] = useState([])
const settings = useSelector((state) => state.users.settings);


useEffect(() => {
  const classinter = settings.Classes;
    setClassOrder(classinter.map((item) => Object.keys(item)[0]));
  
}, [])


const handleCheckboxChange = (event) => {
  const className = event.target.name;
  setSelectedClasses(prevSelectedClasses => {
    const updatedSelectedClasses = [...prevSelectedClasses];
    if (event.target.checked) {
      updatedSelectedClasses.push(className);
    } else {
      const index = updatedSelectedClasses.indexOf(className);
      if (index !== -1) {
        updatedSelectedClasses.splice(index, 1);
      }
    }
    return updatedSelectedClasses;
  });
};


const fetchEnfants = async () => {
    try {
      const response = await fetch("http://localhost:3000/enfants");
      const data = await response.json();
     
      const sortedEnfantData = data.data
      .filter((e) => e._id !== "63ee549d4b6de7f8cedfcb46" && selectedClasses.includes(e.Classe))
      setEnfantData(sortedEnfantData.sort())


    setEnfantData(sortedEnfantData);
    
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEnfants()
  },[selectedClasses]);

  const planning = enfantData.map((data, i) => {
    const child = data
    return < Planning key={`${data._id}-${i}`} classes="ok"   prenom={data.Prénom} heuresReels={child.HeuresReels}  id={data._id} onSave={fetchEnfants} child={child}  {...data}  />;
  });


    return (
      

      <div className={styles.container} >
        <div className={styles.checkBox}>
        <div>
          <label>
            <input type="checkbox" onChange={(event) => {
              if (event.target.checked) {
                setSelectedClasses(classOrder);
              } else {
                setSelectedClasses([]);
              }
            }} checked={selectedClasses.length ===  classOrder.length} />
            Tout sélectionner
          </label>
        </div>
        {classOrder.map((className) => (
          <div key={className}>
            <label>
              <input type="checkbox" name={className} onChange={handleCheckboxChange} checked={selectedClasses.includes(className)} />
              {className}
            </label>
          </div>
        ))}
        <div>
          <label>
            <input type="checkbox" onChange={(event) => {
              if (event.target.checked) {
                setSelectedClasses([]);
              } else {
                setSelectedClasses(classOrder);
              }
            }} checked={selectedClasses.length === 0} />
            Tout désélectionner
          </label>
        </div>
      </div>
      <div className={styles.planningcontainer}>
      
        {planning}
        
        </div>
        </div>

    )
}
export default Classe;