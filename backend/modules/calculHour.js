import {getPlanningById} from "./planningforone"
import {  useSelector } from 'react-redux';
import { subtractTime } from "./time";
import { useEffect, useState } from "react";

function calculhour(id, rates) {

  return new Promise((resolve, reject) => {
    fetch("http://localhost:3000/aeshs")
      .then((response) => response.json())
      .then((data) => {
        const childPlanning = getPlanningById(data, id).Planning;
        let total = 0;
        for (let day in childPlanning) {
          for (let shift in childPlanning[day]) {
            if (childPlanning[day][shift].Prénom !== "" ) {                
              let rateInMinutes =
                parseInt(rates[shift].split(":")[0]) * 60 +
                parseInt(rates[shift].split(":")[1]);
              total += rateInMinutes;                    
            }
          }
        }

        let hours = Math.floor(total / 60);
        let minutes = total % 60;
        const totalTime = hours.toString().padStart(2, "0") +
            ":" + minutes.toString().padStart(2, "0");
        console.log("totaltime",totalTime);
        resolve(totalTime);
      })
      .catch((error) => reject(error));
  });
}

  


 export {calculhour}