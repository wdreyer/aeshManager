  import { getPlanningById } from "./planningforone";
  import { calculAllHour } from "./calculAllHours";
  
  async function updateAllChildrenHours(rates) {
    try {
      // Fetch all children
      const response = await fetch("http://localhost:3000/enfants");
      const data = await response.json();
      const children = data.data; // Access the 'data' property
  
      console.log("Fetched children:", children);
  
      // Fetch all AESHs
      const aeshResponse = await fetch("http://localhost:3000/aeshs");
      const aeshData = await aeshResponse.json();
  
      // Loop through all children
      for (const child of children) {
        // Get the child's planning
        const childPlanning = getPlanningById(aeshData, child._id).Planning;
  
        // Calculate the child's hours based on their planning
        const calculatedHours = await calculAllHour(child._id, rates,aeshData);
  
        // If calculatedHours is different from child.HeuresReels, update it in the database
        if (calculatedHours !== child.HeuresReels) {
          await fetch("http://localhost:3000/enfants/updateHeures", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              enfantID: child._id,
              HeuresReels: calculatedHours,
            }),
          });
          console.log(`Updated hours for child ${child._id} from ${child.HeuresReels} to ${calculatedHours}`);
        }
      }
    } catch (error) {
      console.error("Error updating all children hours:", error);
    }
  }

  export { updateAllChildrenHours}
