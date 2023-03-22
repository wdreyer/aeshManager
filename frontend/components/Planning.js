import styles from '../styles/Planning.module.css'
import { useState, useEffect } from 'react';
import { subtractTime, multiplyTime } from '../modules/time'
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { Select, InputNumber, Input,Button, Modal, Space } from 'antd';
import {getPlanningById} from "../modules/planningforone"
import {  useSelector } from 'react-redux';
import { calculhour } from '../modules/calculHour';
import { calculateTotalAesh } from '../modules/calculHourAesh';
import { calculAllHour } from '../modules/calculAllHours';
import { updateAllChildrenHours} from '../modules/updateChildHours';

function Planning(props) {
  const [planning, setPlanning] = useState([]);
  const [heurresReals, setHeurresReals] = useState("00:00");
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
  const [oldPrenom, setOldPrenom] = useState('');
  const [contrat,setContrat] = useState('');
  const [aeshPrenom,setPrenomAesh] = useState('')
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [newAeshData, setNewAeshData] = useState(null);
  const [selectKey, setSelectKey] = useState(0);
  const [selectKeyMinutes, setSelectKeyMinutes] = useState(0);



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


const  transformPlanningData = (planningData) => {
    const transformedData = {};
  
    for (const day in planningData) {
      transformedData[day] = {};
      for (const period in planningData[day]) {
        transformedData[day][period] = planningData[day][period]._id;
      }
    }
  
    return transformedData;
  }

  function resetFields() {
    setIsEditing(true);
    setPrenom('');
    setSelectedCategory('');
    setSelectedValue('');
    setHours(0);
    setMinutes(0);
    setEditedCells([]);
    setSelectKey(selectKey + 1);
  }


  if (props.child) {
    useEffect(() => {
      setOldPrenom(props.prenom);
      const [heureEnChiffres, minutesEnChiffres] = props.child.Heures.split(":").map(Number);
      setHours(heureEnChiffres);
      setMinutes(minutesEnChiffres);
    }, []);


  }
  if (props.Aesh) {
    useEffect(() => {
      setOldPrenom(props.Aesh.Prénom);
      setContrat(props.Aesh.Contrat);
      setHeurresReals(props.Aesh.HeuresReels)
      const [heureEnChiffres, minutesEnChiffres] = props.Aesh.Contrat.split(":").map(Number);
      setHours(heureEnChiffres);
      setMinutes(minutesEnChiffres);
    }, [props]);
  }



  const warning = () => {
    Modal.warning({
      title: 'Attention',
      content: `Vous n'avez pas ou mal rempli tous les champs`,
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

    
    useEffect(() => {
      if (props.newChild || props.newAesh) {
        setIsEditing(true);
        setPrenom('');
        setSelectedCategory('');
        setSelectedValue('');
        setHours(0);
        setMinutes(0);
        setPlanning([]);
      }
    }, [props.newChild, props.newAesh]);

  // on crée les listes selectionnables
  if (props.Aesh || props.newAesh) {
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
  },[props])
 
    useEffect(() => {
      fetch('http://localhost:3000/aeshs')
        .then(response => response.json())
        .then(data => { 
          const childPlanning = getPlanningById(data, props.id);
          setPlanning(childPlanning.Planning)            
       });
      }, [isEditing,editedCells,props])
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
   if(props.Aesh ){
    let newCell = { day: rowKey , shift: cellId , value: selectedOption  }; //,
    if(selectedOption === "Ajouter"){
      return
    }
    if(selectedOption === undefined) {
    newCell = { day:rowKey , shift: cellId , value: "63ee549d4b6de7f8cedfcb46" }; // , 

  }
    setEditedCells((prev) => [...prev, newCell]);

}
else if (props.child) {
  let newCell = { day: rowKey, shift: cellId, value: props.id, addTo: selectedOption };

  if (selectedOption === "Ajouter") {
    return;
  }

  if (selectedOption === undefined) {
    if (planning[rowKey] && planning[rowKey][cellId] && planning[rowKey][cellId]._id) {
      const idAesh = planning[rowKey][cellId]._id;
      newCell = { day: rowKey, shift: cellId, value: "63ee549d4b6de7f8cedfcb46", addTo: idAesh };

      // Remove the old reference from editedCells
      setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));

      // Add the new reference with the "63ee549d4b6de7f8cedfcb46" value
      setEditedCells(prev => [...prev, newCell]);
    } else {
      return;
    }
  } else {
    // If the cell has an AESH, first set its value to "63ee549d4b6de7f8cedfcb46"
    if (planning[rowKey] && planning[rowKey][cellId] && planning[rowKey][cellId]._id) {
      const idAesh = planning[rowKey][cellId]._id;
      const oldCell = { day: rowKey, shift: cellId, value: "63ee549d4b6de7f8cedfcb46", addTo: idAesh };
      
      // Remove the old reference from editedCells
      setEditedCells(prev => prev.filter(cell => !(cell.day === oldCell.day && cell.shift === oldCell.shift)));

      // Add the new reference with the "63ee549d4b6de7f8cedfcb46" value
      setEditedCells(prev => [...prev, oldCell]);
    }

    // Add the new reference with the selected AESH
    setEditedCells(prev => [...prev, newCell]);
  }
}
else if (props.newChild) {
  console.log("inside");
  let newCell = { day: rowKey, shift: cellId, value: "", addTo: selectedOption };
  console.log(newCell);

  if (selectedOption === "Ajouter" || selectedOption === undefined) {
    if (editedCells.some(cell => cell.day === rowKey && cell.shift === cellId)) {
      setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));
    }
  }
  // If the cell already has data, remove it from the editedCells array
  else if (planning[rowKey] && planning[rowKey][cellId] && planning[rowKey][cellId]._id) {
    setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));
  }
  // If the cell doesn't have data, add the new cell to the editedCells array
  else {
    setEditedCells((prev) => [...prev, newCell]);
  }
}

  else if (props.newAesh){   
    let newCell = { day: rowKey , shift: cellId , value: selectedOption  }; //,
    if(selectedOption === undefined){
      newCell = { day: rowKey , shift: cellId , value: "63ee549d4b6de7f8cedfcb46" }; 
      if(editedCells.some(cell => cell.day === rowKey && cell.shift === cellId)) {
        setEditedCells(prev => prev.filter(cell => !(cell.day === rowKey && cell.shift === cellId)));
      }
      else {
       newCell = { day: rowKey , shift: cellId , value: "63ee549d4b6de7f8cedfcb46" }; 
      }
    }
    setEditedCells((prev) => [...prev, newCell]);

  }


}   




const handleEdit = () => {    // rendre éditable :  
    setIsEditing(true);   
}

  // sauvegarder l'édition 
const updateCalendar = async () => {
  if(props.newChild || props.newAesh){
    if( prenom.length <3 || selectedValue === undefined  ){
    warning();
    return
    }
  }
 if(props.newAesh){
  const heureEnChiffres = hours.toString().padStart(2, "0")
  const minutesEnChiffres = minutes.toString().padStart(2, "0")
  setContrat(heureEnChiffres + ':' + minutesEnChiffres)
  const HeuresReels = calculateTotalAesh(editedCells,rates) 
  try {
    const response = await fetch(`http://localhost:3000/aeshs/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prenom: prenom,
        contrat: heureEnChiffres + ':' + minutesEnChiffres,
        Planning: editedCells,
        HeuresReels: HeuresReels,
      }),
    });  
    if (response.ok) {
      resetFields()
      props.onSave()

    } else {
      console.error('Error updating calendar: Invalid response');
    }
    try {
      await updateAllChildrenHours(rates);
      props.onSave();
      setEditedCells([]);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating child hours:', error);
    } 
  } 
  catch (err) {
    console.error('Error updating calendar:', err);
  }

 }    
    if(props.Aesh ){    
      const heureEnChiffres = hours.toString().padStart(2, "0")
      const minutesEnChiffres = minutes.toString().padStart(2, "0")
      setContrat(heureEnChiffres + ':' + minutesEnChiffres)
      try {
        const updatedAesh = await fetch(`http://localhost:3000/aeshs/${props.Aesh._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prenom: aeshPrenom,
            contrat : heureEnChiffres + ':' + minutesEnChiffres,
            Planning: editedCells
          })
        })
        const data = await updatedAesh.json();
        console.log("isdifférent", data.Planning)
        const heuresReels = calculateTotalAesh(data.Planning,rates);       
        try {
          const updatedAesh = await fetch(`http://localhost:3000/aeshs/updateHours/${props.Aesh._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              HeuresReels: heuresReels
            })
          })          
        }
          catch (err) {
            console.log('Error updating Hours', err);
          }
        try {
          await updateAllChildrenHours(rates);
          props.onSave();
          setEditedCells([]);
          setIsEditing(false);
        } catch (error) {
          console.error('Error updating child hours:', error);
        } 
      } catch (err) {
      console.log('Error updating calendar:', err);
    }
  }
  if (props.child) {
    const heureEnChiffres = hours.toString().padStart(2, "0");
    const minutesEnChiffres = minutes.toString().padStart(2, "0");
    setHeures(heureEnChiffres + ':' + minutesEnChiffres);
  
    try {
      // Update the child
      await fetch("http://localhost:3000/enfants/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID: props.id,
          prenom: oldPrenom,
          heures: heureEnChiffres + ':' + minutesEnChiffres,
          classe: selectedCategory,
          prof: selectedValue,
        }),
      });
  
      // Loop through the editedCells
      for (const cell of editedCells) {
        const { addTo } = cell;
  
        // Update the Aesh planning
        await fetch(`http://localhost:3000/aeshs/editKid/${addTo}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Planning: cell
          })
        });
  
        // Get the planning
        const planningResponse = await fetch(`http://localhost:3000/aeshs/getOne/${addTo}`);
        const planningData = await planningResponse.json();
        const planning = transformPlanningData(planningData.Planning);
  
        // Calculate the hours
        const heuresReels = calculateTotalAesh(planning, rates);
  
        // Update the hours
        await fetch(`http://localhost:3000/aeshs/updateHours/${addTo}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            HeuresReels: heuresReels
          })
        });
      }
  
      // Update total time and reset fields
      const total = await calculhour(props.id, rates);
      setTotalTime(total);
      await fetch("http://localhost:3000/enfants/updateHeures", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enfantID: props.id,
          HeuresReels: total,
        }),
      });
  
      await updateAllChildrenHours(rates);
      resetFields();
      setIsEditing(false)
      props.onSave();
  
    } catch (err) {
      console.error('Error:', err);
    }
  }
  if (props.newChild) {
    const heuresReels = calculateTotalAesh(editedCells,rates)
    const heureEnChiffres = hours.toString().padStart(2, "0")
    const minutesEnChiffres = minutes.toString().padStart(2, "0")
    setHeuresAcc(heureEnChiffres + ':' + minutesEnChiffres)   
   const requestBody = {
      prenom: prenom,
      classe: selectedCategory,
      prof: selectedValue,
      heures: heureEnChiffres + ':' + minutesEnChiffres,
      hReel: heuresReels,
      planning: editedCells,
      rates: rates,
    };

    console.log("body to send",requestBody)
  
    fetch("http://localhost:3000/enfants/postAndEdit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Erreur HTTP :", response.status);
          // Handle the error...
          throw new Error("HTTP error");
        }
      })
      .then(async responseData => {
        const idNewKid = responseData.kid._id;      
        const total = await calculhour(idNewKid, rates);
        console.log("on calcule le total :", total)
        setTotalTime(total);      
        fetch("http://localhost:3000/enfants/updateHeures", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enfantID: idNewKid, // Use the new child's ID
            HeuresReels: total,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.log("Erreur HTTP :", response.status);
              // Handle the error...
              throw new Error("HTTP error");
            }
          })
          .then(async () => {          
            // Loop through the editedCells
            for (const cell of editedCells) {
              const aeshId = cell.addTo;
              // Get the planning
              const planningResponse = await fetch(`http://localhost:3000/aeshs/getOne/${aeshId}`);
              console.log("1",planningResponse)

              const planningData = await planningResponse.json();
              console.log("2",planningData)

              const planning = transformPlanningData(planningData.Planning);
              console.log("3",planning)
          
              // Calculate the hours
              const heuresReels = calculateTotalAesh(planning, rates);
              console.log("4",heuresReels)

              console.log('5', aeshId)

              // Update the hours
              const updateAeshResponse = await fetch(`http://localhost:3000/aeshs/updateHours/${aeshId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  HeuresReels: heuresReels
                })
              });
          
              const updateAeshData = await updateAeshResponse.json();
              console.log(`Update Aesh ${aeshId} response:`, updateAeshData);
            }
            try {
              await updateAllChildrenHours(rates);
              resetFields()
              props.onSave();
            } catch (error) {
              console.error('Error updating child hours:', error);
            }
          })
          .catch((error) => {
            console.log("Erreur de la requête :", error.message);
            // Handle the error...
          });
      })
      .catch(error => {
        console.log("Erreur de la requête :", error.message);
        // Handle the error...
      });
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
            <td>{rowKey === "Amidi1" ? "A-midi 1" : rowKey === "Amidi2" ? "A-midi 2" : rowKey.replace("Matin", "Matin ")}</td>
            {["lundi", "mardi", "jeudi", "vendredi"].map((dayKey, colIndex) => (
              <td key={colIndex}>
                {isEditing ? (
                  <Select
                  key={selectKey}
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
          <div className={styles.rightSideDiv}>
            <span key="prenom">{props.classes ? "" : "Prénom :"}</span>
             {isEditing ? (
            <Input
              value={oldPrenom}
              
              onChange={(event) => setOldPrenom(event.target.value)}
              
            />
          ) : (
            <span className={styles.prenomNotEditable}>{oldPrenom}</span>
          )}
          </div>         

          {isEditing ? (
            <>
            <div className={styles.rightSideDiv} > 
          <span key="classe">{props.classes ? "" : "Classe :"}</span>
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
            <div className={styles.rightSideDiv}>
            <span key="prof">{props.classes ? "" : "Prof :"}</span>
           
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
              
              </div>
            </>
          ) : (
            <>
            <div className={styles.rightSideDiv}>
            <span key="classe">{props.classes ? "" : "Classe :"}</span>
            <span key="classe-valeur">{selectedCategory}</span>
          </div>
          <div className={styles.rightSideDiv}>
            <span key="prof">{props.classes ? "" : "Prof :"}</span>
            <span key="prof-valeur"></span>
            {selectedValue}
          </div>
          </>
          )}
          <div className={styles.rightSideDiv}>
            <span key="heures-accordees">{props.classes ? "" : "Heures"}</span>
           {isEditing ? (
            <div className={styles.hContainer} >
            <InputNumber key={selectKey + 1} style={{width: '55px' , padding: '0px'}} className={styles.hour}   onChange={value => setHours(value)} min={0} max={50} defaultValue={hours}   />
            <span className={styles.doublepoint}> : </span> <InputNumber key={selectKey}  style={{width: '55px' , padding: '0px'}} className={styles.hour} onChange={(value) => setMinutes(value)} min={0} max={45} step={15} defaultValue={minutes}  />
            </div> 
            ): (
              <span>{props.child.Heures}</span>
              )}
          </div>
          <div className={styles.rightSideDiv} >
            <span key="heures-reelles">{props.classes ? "" : "Heures réelles :"}</span>
            {props.heuresReels}
          </div>
          <div className={styles.rightSideDiv}>
            <span key="difference">{props.classes ? "" : "Différence : :"}</span>
            <span key="difference-valeur">{subtractTime(heures,props.heuresReels)}</span>
          </div>
        </>
      )}
      {props.newChild && (
        <>
          <div className={styles.rightSideDiv}>
            <span key="prenom">Prénom </span>
            <Input placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} value={prenom} />
          </div>
          <div className={styles.rightSideDiv} >
            <span key="classe">Classe :</span>
            <span key="classe-valeur">
              {" "}
              <Select  key={selectKey} defaultValue={selectedCategory} style={{ width: 100 }} onChange={handleCategoryChange} options={categoryOptions} placeholder="Select a category" />
            </span>
          </div>
          <div className={styles.rightSideDiv}>
            <span key="prof">Prof :</span>
            <span key="prof-valeur">
              {" "}
              <Select   key={selectKey} value={selectedValue} style={{ width: 100 }} onChange={handleValueChange} options={valueOptions} placeholder="Select a value" disabled={selectedCategory === ""} />
            </span>
          </div>
          <div className={styles.rightSideDiv} >
          <span key="heures-accordees">{props.classes ? "" : "Heures"}</span>
          <div className={styles.hContainer} >
            <InputNumber    style={{width: '55px' , padding: '0px'}} className={styles.hour}   onChange={value => setHours(value)} min={0} max={50} value={hours}   />
            <span className={styles.doublepoint}> : </span> <InputNumber      style={{width: '55px' , padding: '0px'}} className={styles.hour} onChange={(value) => setMinutes(value)} min={0} step={15} max={45} value={minutes}  />
            </div> 
            
          </div>
          <div className={styles.rightSideDiv} >
            <span key="heures-reelles">Heures réelles :</span>
            <span key="heures-reelles-valeur">{heurresReals}</span>
          </div>
          <div className={styles.rightSideDiv} >
            <span key="difference">Différence :</span>
            <span key="difference-valeur">{diff}</span>
          </div>
        </>
      )}
      {props.Aesh  && (
       
        <>
          <div  className={styles.rightSideDiv} >
            <span key="prenom">Prénom :</span>
            {isEditing ? (
              <Input
                value={oldPrenom}
                
                onChange={(event) => setOldPrenom(event.target.value)}
                
              />
            ) : (
              <span className={styles.prenomNotEditable}>{oldPrenom}</span>
            )}
            </div>
          <div  className={styles.rightSideDiv} >
            <span key="contrat">Contrat :</span>
            {isEditing ? (
              <div className={styles.hContainer} >
              <InputNumber  style={{width: '55px' , padding: '0px'}} className={styles.hour}   onChange={value => setHours(value)} min={0} max={50} defaultValue={hours}   />
              <span className={styles.doublepoint}> : </span> <InputNumber   style={{width: '55px' , padding: '0px'}} className={styles.hour} onChange={(value) => setMinutes(value)} min={0} max={45} step={15} defaultValue={minutes}  />
              </div> 
              ): (
                <span>{contrat}</span>
                )}
          </div>
          <div  className={styles.rightSideDiv} >
            <span key="hReals">Heures Réelles :</span>
            <span key="hReals-valeur">{heurresReals}</span>
          </div>
          <div  className={styles.rightSideDiv}>
            <span key="diff">Différence :</span>
            <span key="diff-valeur">{subtractTime(contrat,heurresReals)}</span>
          </div>
        </>
      )}
      {props.newAesh  && (
        <>
          <div className={styles.rightSideDiv}>
            <span key="prenom">Prénom :</span>
            <Input placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} value={prenom} />          </div>
          <div className={styles.rightSideDiv}>
            <span key="contrat">Contrat :</span>
            <div className={styles.hContainer} >
            <InputNumber  style={{width: '55px' , padding: '0px'}} className={styles.hour}   onChange={value => setHours(value)} min={0} max={50} defaultValue={hours}   />
            <span className={styles.doublepoint}> : </span> <InputNumber   style={{width: '55px' , padding: '0px'}} className={styles.hour} onChange={(value) => setMinutes(value)} min={0} max={45} step={15} defaultValue={minutes}  />
            </div>           </div>
          <div className={styles.rightSideDiv}>
            <span key="hReals">Heures Réelles :</span>
            <span key="hReals-valeur">{heurresReals}</span>
          </div>
          <div className={styles.rightSideDiv}>
            <span key="diff">Différence :</span>
            <span key="diff-valeur">{diff}</span>
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