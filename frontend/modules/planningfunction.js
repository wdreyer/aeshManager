function getPlanningByAESH(planning, aeshName) {


    let result = {
        "Prénom": aeshName,
        "Planning": {}
      };
    
      planning.forEach(p => {
        let prénom = p.Prénom || "";
        let id = p._id;
        let days = Object.keys(p.Planning);
        days.forEach(day => {
          if (!result.Planning[day]) {
            result.Planning[day] = {};
          }
          let slots = Object.keys(p.Planning[day]);
          slots.forEach(slot => {
            if (p.Planning[day][slot]._id === aeshName) {
                result.Planning[day][slot] = {
                    "Prénom": prénom,
                    "idAesh" : id,
                  };
            } else if (!result.Planning[day][slot]) {
                result.Planning[day][slot] = {
                    "Prénom": ""
                  };
            }
          });
        });
        if (id === aeshName) {
          result.Prénom = prénom;
        }
      });
    
      return result;
    }


export {getPlanningByAESH}