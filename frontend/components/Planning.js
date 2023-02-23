import styles from '../styles/Planning.module.css'
import { useState, useEffect } from 'react';
import { subtractTime, multiplyTime } from '../modules/time'
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { Select, Input,Button, Modal, Space } from 'antd';
import {getPlanningById} from "../modules/planningforone"
import {  useSelector } from 'react-redux';
import { calculhour } from '../modules/calculHour';
      
function Planning(props) {
  const [planning, setPlanning] = useState([]);
  const [heurresReals, setHeurresReals] = useState(0);
  const [diff, setDiff] = useState(0);
  const [totalTime,setTotalTime] = useState(0)
  const [enfantData, setEnfantData] = useState([]);
  const [aeshData, setAeshData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCells, setEditedCells] = useState([]);
  const [list,setList] = useState();
  const [prenom, setPrenom] = useState('');
  const [heuresAcc,setHeuresAcc] = useState('');
  const [heures, setHeures] = useState('');

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const settings = useSelector((state) => state.users.settings);
  let intRates = {};
  intRates.Matin1 = subtractTime(settings.Matin1.hEnd, settings.Matin1.hStart);
  intRates.Matin2 = subtractTime(settings.Matin2.hEnd, settings.Matin2.hStart);
  intRates.Amidi1 = subtractTime(settings.AMidi1.hEnd, settings.AMidi1.hStart);
  intRates.Amidi2 = subtractTime(settings.AMidi2.hEnd, settings.AMidi2.hStart);
  const rates = intRates;   
  const classes = settings.Classes;  


  const [oldPrenom, setOldPrenom] = useState(props.prenom);



  const warning = () => {
    Modal.warning({
      title: 'Attention',
      content: 'Vous navez pas ou mal rempli tous les champs',
    });
  };

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
  selectedCategory !== "" && classes.some(category => category.hasOwnProperty(selectedCategory))
    ? classes.find((category) => Object.keys(category)[0] === selectedCategory)[selectedCategory]
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



  if (props.newChild){
    useEffect(() => {
    setIsEditing(true)
  }, []);
  }


  // on crée les listes selectionnables
  if (props.Aesh) {
    useEffect(() => {
      fetch("http://localhost:3000/enfants")
        .then((response) => response.json())
        .then((data) => {
          setEnfantData(data.data.filter(e => e._id !== "63ee549d4b6de7f8cedfcb46"));
          setList(data.data.filter(e => e._id !== "63ee549d4b6de7f8cedfcb46").map((enfant) => ({
            value: enfant._id, // use the ID as the value
            label: enfant.Prénom,
          })));
        });
    }, []);
  }  
  if (props.child || props.newChild) {
    useEffect(() => {
      fetch("http://localhost:3000/aeshs")
        .then((response) => response.json())
        .then((data) => {
          setAeshData(data);
          setList(data.map((aesh) => ({
            value: aesh._id, 
            label: aesh.Prénom,
          })));
        });
    }, []);
  }
  // fin des listes


//affichage planning si child
if (props.child) {
  useEffect(()=>{
    setHeures(props.child.Heures);
    setSelectedCategory(props.child.Classe);
    setSelectedValue(props.child.Prof);
  },[])
 
    useEffect(() => {
      fetch('http://localhost:3000/aeshs')
        .then(response => response.json())
        .then(data => { 
          const childPlanning = getPlanningById(data, props.id);
          setPlanning(childPlanning.Planning)            
       });
      }, [isEditing,editedCells])
  }
// affichage planning si AESH
  if (props.Aesh) {
   
    useEffect(() => {
    fetch(`http://localhost:3000/aeshs/getOne/${props.Aesh._id}`)
      .then(response => response.json())
      .then(data => { 
        setPlanning(data.Planning)        
     });
    }, [isEditing,editedCells])
  }
  // fin affichage des plannings

  // début modification du planning :
  const handleSelectChange = (selectedOption, rowKey, cellId) => {
   if(props.Aesh){
    let newCell = { day: rowKey , shift: cellId , value: selectedOption  }; //,
    if(selectedOption === "Ajouter"){
      return
    }
    if(selectedOption === undefined) {
    newCell = { day:rowKey , shift: cellId , value: "63ee549d4b6de7f8cedfcb46" }; // , 

  }
    setEditedCells((prev) => [...prev, newCell]);

}
else if (props.child){
  let newCell = { day: rowKey , shift: cellId , value: props.id , addTo : selectedOption }; 
  if(selectedOption === "Ajouter"){
    return
  }
  if(selectedOption === undefined) {
    if(editedCells.some(cell => cell.day === rowKey && cell.shift === cellId)) {
      setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));
    } else if (planning[rowKey] && planning[rowKey][cellId] && planning[rowKey][cellId]._id){

      const idAesh = planning[rowKey][cellId]._id 
      newCell = { day: rowKey , shift: cellId , value: "63ee549d4b6de7f8cedfcb46", addTo: idAesh };
    }
    else {
      return
    }
  }
  setEditedCells(prev => [...prev, newCell]);
}
else if ( props.newChild){
  let newCell = { day: rowKey , shift: cellId , value: "" , addTo : selectedOption  }; 
  if(selectedOption === "Ajouter" || undefined){
    if(editedCells.some(cell => cell.day === rowKey && cell.shift === cellId)) {
      setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));
    }
    else if (planning[rowKey] && planning[rowKey][cellId] && planning[rowKey][cellId]._id){
     newCell = { day: rowKey , shift: cellId , value: "", addTo : ""  }; 
    }
  }


  setEditedCells((prev) => [...prev, newCell]);
  console.log(editedCells)

}   
};

const handleEdit = () => {    // rendre éditable :  
    setIsEditing(true);   
}

  // sauvegarder l'édition 
  // sauvegarder l'édition 
const updateCalendar = async () => {
  if(props.newChild){
    if( prenom.length <3 || selectedValue === undefined  ){
    warning();
    return
    }
  }

    
    if(props.Aesh){     
    try {
      console.log("readytoedit",editedCells)
      const updatedAesh = await fetch(`http://localhost:3000/aeshs/${props.Aesh._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Planning: editedCells
        })
      }).then((res) => res.json());
  
      console.log('Calendar updated:', updatedAesh);
   
    } catch (err) {
      console.log('Error updating calendar:', err);
    }
    setEditedCells([]);
    setIsEditing(false);
  }
  if (props.child  ) {
    console.log("try to update", selectedCategory)
    try {
      const response = await fetch("http://localhost:3000/enfants/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID: props.id,
          prenom: oldPrenom,          
          heures: heures,
          classe: selectedCategory ,
          prof: selectedValue,
        }),
      });
      const data = await response.json();
   
    } catch (error) {
      console.error(error);
    }


    try {

      for (const cell of editedCells) {
        const { day, shift, value, addTo } = cell;   

            await fetch(`http://localhost:3000/aeshs/editKid/${addTo}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                Planning: cell
              })
            });
          
        } 
           const total = await calculhour(props.id, rates);
        setTotalTime(total);

      await fetch("http://localhost:3000/enfants/updateHeures", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID:  props.id,
          HeuresReels: total,
        }),
      });
      props.onSave();
      setEditedCells([]);
      setIsEditing(false);
      }
      catch (err) {
        console.log('Error updating calendar:', err);
      }    
     
      
  }
  if(props.newChild){
    try {
      const response = await fetch(`http://localhost:3000/enfants/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prenom: prenom,
          classe: selectedCategory,
          prof: selectedValue,
          heures: heuresAcc,
          hReel: heurresReals
        })
      });
      if (response.ok) {
        const responseData = await response.json();
        const idNewKid = responseData.kid._id
        console.log("ik",responseData)
        for (const cell of editedCells) {
          const { day, shift, addTo } = cell;
          cell.value = idNewKid;
          console.log("ready to send", cell);
  
          try {
            await fetch(`http://localhost:3000/aeshs/editKid/${addTo}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                Planning: cell
              })
            });
          } catch (err) {
            console.log('Error updating calendar:', err);
          }
        }
        const total = await calculhour(idNewKid, rates);
        setTotalTime(total);

      await fetch("http://localhost:3000/enfants/updateHeures", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID: idNewKid,
          HeuresReels: total,
        }),
      });
      setPrenom('');
      props.onSave();
      } else {
        console.log('Erreur HTTP :', response.status);
        // gérer l'erreur...
      }
    } catch (error) {
      console.log('Erreur de la requête :', error.message);
      // gérer l'erreur...
    }
   

  
  }


  };

return (
  <div className={props.classes ? styles.classemodal :styles.modal} >
    <table className={styles.calendar}>
      <thead>
        <tr>
          <th></th>
          <th>Lundi</th>
          <th>Mardi</th>
          <th>Jeudi</th>
          <th>Vendredi</th>
        </tr>
      </thead>
      <tbody>
        {["Matin1", "Matin2", "Amidi1", "Amidi2"].map((rowKey, rowIndex) => (
          <tr key={rowIndex}>
            <td>{rowKey === "Amidi1" ? "Après-midi 1" : rowKey === "Amidi2" ? "Après-midi 2" : rowKey.replace("Matin", "Matin ")}</td>
            {["lundi", "mardi", "jeudi", "vendredi"].map((dayKey, colIndex) => (
              <td key={colIndex}>
                {isEditing ? (
                  <Select
                    showSearch
                    placeholder="Ajouter"
                    allowClear
                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                    defaultValue={planning[dayKey] && planning[dayKey][rowKey] && planning[dayKey][rowKey].Prénom ? planning[dayKey][rowKey].Prénom : "Ajouter"}
                    options={list}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "200px",
                      }),
                    }}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, dayKey, rowKey)}
                  />
                ) : (
                  planning[dayKey] && planning[dayKey][rowKey] && planning[dayKey][rowKey].Prénom // sinon, afficher la valeur actuelle de la case
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className={props.classes ? styles.rightSideCLasse : styles.rightSide}>
      {props.child && (
        <>
          <div>
            <span key="prenom">Prénom :</span>
            <span
            contentEditable={isEditing}
            className={
              isEditing ? styles.prenomEditable : styles.prenomNotEditable
            }
            onBlur={(event) => setOldPrenom(event.target.innerText)}
          >
           {oldPrenom}
          </span>
          </div>         

          {isEditing ? (
            <>
            <div>
          <span key="classe">Classe :</span>
           <span key="classe-valeur">
              <Select
                defaultValue={{
                  value: selectedCategory,
                  label: selectedCategory,
                }}
                style={{ width: 100 }}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Select a category"
              />
            </span>
            </div>
            <div>
            <span key="prof">Prof :</span>
            <span>
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
              </div>
            </>
          ) : (
            <>
            <div>
            <span key="classe">Classe :</span>
            <span key="classe-valeur">{selectedCategory}</span>
          </div>
          <div>
            <span key="prof">Prof :</span>
            <span key="prof-valeur"></span>
            {selectedValue}
          </div>
          </>
          )}
          <div>
            <span key="heures-accordees">Heures accordées :</span>
            <span key="heures-accordees-valeur"><span
            contentEditable={isEditing}
            className={
              isEditing ? styles.heureEditable : styles.heureNotEditable
            }
            onBlur={(event) => setHeures(event.target.innerText)}
          >
            {heures}
          </span></span>
          </div>
          <div>
            <span key="heures-reelles">Heures réelles :</span>
            {props.heuresReels}
          </div>
          <div>
            <span key="difference">Différence :</span>
            <span key="difference-valeur">{subtractTime(heures,props.heuresReels)}</span>
          </div>
        </>
      )}
      {props.newChild && (
        <>
          <div>
            <span key="prenom">Prénom </span>
            <Input placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} value={prenom} />
          </div>
          <div>
            <span key="classe">Classe :</span>
            <span key="classe-valeur">
              {" "}
              <Select defaultValue={selectedCategory} style={{ width: 100 }} onChange={handleCategoryChange} options={categoryOptions} placeholder="Select a category" />
            </span>
          </div>
          <div>
            <span key="prof">Prof :</span>
            <span key="prof-valeur">
              {" "}
              <Select value={selectedValue} style={{ width: 100 }} onChange={handleValueChange} options={valueOptions} placeholder="Select a value" disabled={selectedCategory === ""} />
            </span>
          </div>
          <div>
            <span key="heures-accordees">Heures accordées :</span>
            <Input placeholder="Heures Acc." onChange={(e) => setHeuresAcc(e.target.value)} value={heuresAcc} />
          </div>
          <div>
            <span key="heures-reelles">Heures réelles :</span>
            <span key="heures-reelles-valeur">{heurresReals}</span>
          </div>
          <div>
            <span key="difference">Différence :</span>
            <span key="difference-valeur">{diff}</span>
          </div>
        </>
      )}
      {props.Aesh && (
        <>
          <div>
            <span key="prenom">Prénom :</span>
            <span key="prenom-valeur">{props.Aesh.Prénom}</span>
          </div>
          <div>
            <span key="contrat">Contrat :</span>
            <span key="contrat-valeur">{props.Aesh.Contrat}</span>
          </div>
          <div>
            <span key="hReals">Heures Réelles :</span>
            <span key="hReals-valeur">{props.hReals}</span>
          </div>
          <div>
            <span key="diff">Différence :</span>
            <span key="diff-valeur">{props.diff}</span>
          </div>
        </>
      )}
    </div>
    {!isEditing && !props.newChild && <AiOutlineEdit onClick={() => handleEdit()} className={props.classes ? styles.editCLasse : styles.edit} />}
    {isEditing && <AiOutlineSave onClick={() => updateCalendar()} className={props.classes ? styles.editCLasse : styles.edit} />}
  </div>
);
}

export default Planning;