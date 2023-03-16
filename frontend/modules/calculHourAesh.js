function convertMinutesToTimeString(minutes) {
  let hours = Math.floor(minutes / 60);
  let remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

function calculateTotalAesh(planning, rates) {
  let totalTimeInMinutes = 0;
  
  for (const day in planning) {
    for (const period in planning[day]) {
      if (planning[day][period] && planning[day][period] !== '63ee549d4b6de7f8cedfcb46' && planning[day][period] !== ' ') {
        const rate = rates[period];
        if (rate) {
          const [hours, minutes] = rate.split(':').map(Number);
          totalTimeInMinutes += (hours * 60) + minutes;
        }
      }
    }
  }

  return convertMinutesToTimeString(totalTimeInMinutes);
}

  export {calculateTotalAesh}