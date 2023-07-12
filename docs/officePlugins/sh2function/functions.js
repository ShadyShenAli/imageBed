CustomFunctions.associate("ADD", (function (n, t) {
    return n + t
  })), CustomFunctions.associate("CLOCK", (function (n) {
    var t = setInterval((function () {
          var t = (new Date).toLocaleTimeString();
          n.setResult(t)
        }), 1e3);
    n.onCanceled = function () {
      clearInterval(t)
    };
  })), CustomFunctions.associate("INCREMENT", (function (n, t) {
    var o = 0,
    e = setInterval((function () {
          o += n,
          t.setResult(o)
        }), 1e3);
    t.onCanceled = function () {
      clearInterval(e)
    }
  })), CustomFunctions.associate("LOG", (function (n) {
    return console.log(n),
    n
  })), CustomFunctions.associate("ROLL6SIDED", (function () {
    return Math.floor(6 * Math.random()) + 1
  })), CustomFunctions.associate("WORKINGDAYS", (function(start,week){
    let startDate = new Date(start.replace(/(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3"));
    let days  = [];
    let wdays = [];
    let cWeek = ["Sun","Mon","Feb","Mar","Thu","Fri","Sat"];
    if ( startDate instanceof Date && !isNaN(startDate)){
      let wd = startDate.getDay();
      let start,end;
      switch(wd){
        case 0: 
          start = 1;
          end = 6;
          break;
        case 6: 
          start = 2;
          end = 7;
          break;
        default: 
          start = 0;
          end = 6 - wd;
      }
      for (let a = start; a < end ;a++){
        let day = new Date(startDate.valueOf()+a*24*3600*1000);
        days.push(day.toISOString().split("T")[0]);
        wdays.push(cWeek[day.getDay()]);
      }
      let offset = (new Date(startDate.valueOf()+ (2+end)*24*3600*1000)).valueOf();
      for (let j = 0; j < week-1;j++){
        for (let a = 0;a<5;a++){
          let day = new Date(offset + (j*7+a)*24*3600*1000);
          days.push(day.toISOString().split("T")[0]);
          wdays.push(cWeek[a+1]);
        }
      }
      return [days,wdays];
    }else{
      threw (new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Please provide a valid start date in the form of YYYYMMDD."));
    }
}));
