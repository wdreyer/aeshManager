function subtractTime(time1, time2) {
  let time1InMinutes = parseInt(time1.split(":")[0]) * 60 + parseInt(time1.split(":")[1]);
  let time2InMinutes = parseInt(time2.split(":")[0]) * 60 + parseInt(time2.split(":")[1]);
  let resultInMinutes = time1InMinutes - time2InMinutes;
  let hours = Math.floor(Math.abs(resultInMinutes) / 60);
  let minutes = Math.abs(resultInMinutes) % 60;
  let sign = (resultInMinutes < 0) ? "-" : "";
  return sign + hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
}

  function multiplyTime(time, multiplier) {
    let timeInMinutes = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
    let resultInMinutes = timeInMinutes * multiplier;
    let hours = Math.floor(resultInMinutes / 60);
    let minutes = resultInMinutes % 60;
    return hours + ":" + minutes;
  }



  
  export {subtractTime,multiplyTime}
