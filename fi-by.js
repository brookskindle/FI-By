// Requires the fi.js library to be loaded independently

FI.calculate_fi = function() {
  // Main entry point for the program
  var calculation = FI.get_user_calculation();
  FI.set_form_defaults(calculation);

  var years = calculation.years_to_fi().toFixed(2);  // eg: 9.45
  document.getElementById("years_to_fi_result").innerHTML = years;

  var savings_rate = calculation.savings() / calculation.income * 100;
  savings_rate = savings_rate.toFixed(2); // eg: 23.75

  document.getElementById("savings_rate_result").innerHTML = savings_rate;

  var expenses = calculation.expenses.toLocaleString(); // eg: 50,340.22
  document.getElementById("expense_result").innerHTML = expenses;

  var swr = calculation.swr;
  document.getElementById("withdrawal_rate_result").innerHTML = swr;

  var nestegg = calculation.nestegg().toLocaleString();
  document.getElementById("nest_egg_result").innerHTML = nestegg;

  networth_by_month = calculation.per_month();
  FI.graph_fi(networth_by_month);
}

FI.get_user_calculation = function() {
  // Gets the user's input for calculating his time to financial independence
  var calc = Object.create(FI.FICalculation);

  calc.income = Number(FI.get_query_variable("income")) || calc.income;
  calc.expenses = Number(FI.get_query_variable("expenses")) || calc.expenses;
  calc.roi = Number(FI.get_query_variable("roi")) || calc.roi;
  calc.swr = Number(FI.get_query_variable("swr")) || calc.swr;
  calc.networth = Number(FI.get_query_variable("networth")) || calc.networth;

  return calc;
}

FI.get_query_variable = function(variable) {
  // from https://css-tricks.com/snippets/javascript/get-url-variables/
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

FI.set_form_defaults = function(calc) {
  // Set default values on the form fields
  document.getElementById("income").value = calc.income;
  document.getElementById("expenses").value = calc.expenses;
  document.getElementById("savings").value = calc.savings();
  document.getElementById("roi").value = calc.roi;
  document.getElementById("swr").value = calc.swr;
  document.getElementById("networth").value = calc.networth;
}

FI.graph_fi = function(networths) {
  // networths is an array of numbers representing the growing (or shrinking)
  // networth. It is per month.

  // vis.js expects the x axis to be dates ("yyyy-mm-dd"). Build a timeline of
  // months to FI starting from today
  var items = [];
  // use moment.js for sane date calculations
  var date = moment();
  var i;
  for (i = 0; i < networths.length; i++) {
    var networth = networths[i];
    var datestring = date.format("YYYY-MM-DD");
    date.add(1, "month");
    items.push({
      x: datestring,
      y: networth,
      group: "Networth",
    });
  }

  var dataset = new vis.DataSet(items);
  var options = {
    drawPoints: false,
    legend: true,
    clickToUse: true,
    defaultGroup: "",
  };

  //actually graph it
  var container = document.getElementById("canvas_div");
  var graph2d = new vis.Graph2d(container, dataset, options);
};

FI.calculate_fi();
