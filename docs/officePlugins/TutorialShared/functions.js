/**
 * Add two numbers
 * @customfunction
 * @param {number} first First number
 * @param {number} second Second number
 * @returns {number}
 **/
function add(first, second) {
  return first + second;
}
CustomFunctions.associate("ADD", add);

/**
 * Displays the current time once a second
 * @customfunction
 * @param {CustomFunctions.StreamingInvocation<string>} invocation - Parameter to send results to Excel or respond to the user canceling the function.
 * @returns {string}
 **/
function clock(invocation) {
  var t = setInterval((function () {
        var t = (new Date).toLocaleTimeString();
        invocation.setResult(t)
      }), 1e3);
  invocation.onCanceled = function () {
    clearInterval(t)
  };
}
CustomFunctions.associate("CLOCK", clock);

/**
 * Increments the cell with a given amount at a specified interval in milliseconds.
 *	@customfunction
 * @param {number} amount - The amount to add to the cell value on each increment.
 * @param {number} interval - The time in milliseconds to wait before the next increment on the cell.
 * @param {CustomFunctions.StreamingInvocation<number>} invocation - Parameter to send results to Excel or respond to the user canceling the function.
 * @returns {number} An incrementing value.
 */
function increment(amount, interval, invocation) {
  let result = 0;
  const timer = setInterval(() => {
    result += amount;
    invocation.setResult(result);
  }, interval);

  invocation.onCanceled = () => {
    clearInterval(timer);
  }
}
CustomFunctions.associate("INCREMENT", increment);

/**
 * Writes a message to console.log()
 * @customfunction
 * @param {string} n - message to log
 * @returns {string}
 **/
function log(n) {
  console.log(n);
  return n;
}
CustomFunctions.associate("LOG", log);

/**
 * Simulates rolling a 6-sided dice
 * @customfunction
 * @returns {number}
 * @volatile
 **/
function roll6sided() {
  return Math.floor(6 * Math.random()) + 1
}
CustomFunctions.associate("ROLL6SIDED", roll6sided);

/**
 * list working days
 * @customfunction
 * @param {string} start - Start Date String in YYYYMMDD format
 * @param {number} week - number of weeks to display
 * @returns {string[][]}
 **/
function workingDays(start, week) {
  let startDate = new Date(start.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"));
  let days = [];
  let wdays = [];
  let cWeek = ["Sun", "Mon", "Feb", "Mar", "Thu", "Fri", "Sat"];
  if (startDate instanceof Date && !isNaN(startDate)) {
    let wd = startDate.getDay();
    let start,
    end;
    switch (wd) {
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
    for (let a = start; a < end; a++) {
      let day = new Date(startDate.valueOf() + a * 24 * 3600 * 1000);
      days.push(day.toISOString().split("T")[0]);
      wdays.push(cWeek[day.getDay()]);
    }
    let offset = (new Date(startDate.valueOf() + (2 + end) * 24 * 3600 * 1000)).valueOf();
    for (let j = 0; j < week - 1; j++) {
      for (let a = 0; a < 5; a++) {
        let day = new Date(offset + (j * 7 + a) * 24 * 3600 * 1000);
        days.push(day.toISOString().split("T")[0]);
        wdays.push(cWeek[a + 1]);
      }
    }
    return [days, wdays];
  } else {
    threw(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Please provide a valid start date in the form of YYYYMMDD."));
  }
}
CustomFunctions.associate("WORKINGDAYS", workingDays);

/**
 * The sum of all of the numbers.
 * @customfunction
 * @param operands A number (such as 1 or 3.1415), a cell address (such as A1 or $E$11), or a range of cell addresses (such as B3:F12)
 * @returns {number}
 */
function add2(operand) {
  let total = 0;

  operands.forEach(range => {
    range.forEach(row => {
      row.forEach(num => {
        total += num;
      });
    });
  });

  return total;
}
CustomFunctions.associate("ADD2",add2);

/**
 * Calculates the sum of the specified numbers
 * @customfunction
 * @param {number} first First number.
 * @param {number} second Second number.
 * @param {number} [third] Third number to add. If omitted, third = 0.
 * @returns {number} The sum of the numbers.
 */
function add3(first, second, third) {
  if (third === null) {
    third = 0;
  }
  return first + second + third;
}
CustomFunctions.associate("ADD3", add3);

/**
 * Returns the second highest value in a matrixed range of values.
 * @customfunction
 * @param {number[][]} values Multiple ranges of values.
 * @returns {number}
 */
function secondHighest(values) {
  let highest = values[0][0],
  secondHighest = values[0][0];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (values[i][j] >= highest) {
        secondHighest = highest;
        highest = values[i][j];
      } else if (values[i][j] >= secondHighest) {
        secondHighest = values[i][j];
      }
    }
  }
  return secondHighest;
}
CustomFunctions.associate("SECONDHIGHEST",secondHighest);


/**
 * Return the address of the cell that invoked the custom function.
 * @customfunction
 * @param {number} first First parameter.
 * @param {number} second Second parameter.
 * @param {CustomFunctions.Invocation} invocation Invocation object.
 * @returns {string}
 * @requiresAddress
 */
function getAddress(first, second, invocation) {
  console.log(JSON.stringify(innovation, null, "  "));
  const address = invocation.address;
  return address;
}
CustomFunctions.associate("GETADDRESS",getAddress);

/**
 * Return the addresses of three parameters.
 * @customfunction
 * @param {string} firstParameter First parameter.
 * @param {string} secondParameter Second parameter.
 * @param {string} thirdParameter Third parameter.
 * @param {CustomFunctions.Invocation} invocation Invocation object.
 * @returns {string[][]} The addresses of the parameters, as a 2-dimensional array.
 * @requiresParameterAddresses
 */
function getParameterAddresses(firstParameter, secondParameter, thirdParameter, invocation) {
  console.log(JSON.stringify(invocation, null, "  "));
  const addresses = [
    [invocation.parameterAddresses[0]],
    [invocation.parameterAddresses[1]],
    [invocation.parameterAddresses[2]]
  ];
  return addresses;
}
CustomFunctions.associate("GETPARAMETERADDRESSES",getParameterAddresses);
