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
  FI.graph_fi_plotly(networth_by_month);
};

FI.get_user_calculation = function() {
  // Gets the user's input for calculating his time to financial independence
  var calc = Object.create(FI.FICalculation);

  calc.income = Number(FI.get_query_variable("income1")) || calc.income;
  calc.expenses = Number(FI.get_query_variable("expenses1")) || calc.expenses;
  calc.roi = Number(FI.get_query_variable("roi1")) || calc.roi;
  calc.swr = Number(FI.get_query_variable("swr1")) || calc.swr;
  calc.networth = Number(FI.get_query_variable("networth1")) || calc.networth;

  return calc;
};

FI.get_query_variable = function(variable) {
  // from https://css-tricks.com/snippets/javascript/get-url-variables/
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
};

FI.set_form_defaults = function(calc) {
  // Set default values on the form fields
  document.getElementById("income1").value = calc.income;
  document.getElementById("expenses1").value = calc.expenses;
  document.getElementById("savings1").value = calc.savings();
  document.getElementById("roi1").value = calc.roi;
  document.getElementById("swr1").value = calc.swr;
  document.getElementById("networth1").value = calc.networth;

  var color = FI.get_query_variable("color1")
  var color_input = document.getElementById("color1");
  if (color) {
    color_input.value = color.replace("%23", "#");
  }
  else {
    color_input.value = "#1100ff";
  }

  document.getElementById("label1").value = FI.get_query_variable("label1") || "Networth";
};

FI.graph_fi_plotly = function(networths) {
  var x = [];
  var y = [];
  var i;
  for (i = 0; i < networths.length; i++) {
    x.push(i);
    var networth = networths[i].toFixed(2);
    y.push(networths[i].toFixed(2));
  }

  var items = {
    x: x,
    y: y,
    mode: "lines",
    line: {
      color: document.getElementById("color1").value,
    },
    name: document.getElementById("label1").value,
    hoverinfo: "name+x+y",
  };

  var data = [items];

  // TODO: remove when done testing
  var x2 = [];
  var y2 = [];
  for (i = 0; i < networths.length / 1.50; i++) {
    x2.push(i);
    var networth = networths[i].toFixed(2);
    y2.push(networths[i].toFixed(2) / 2);
  }

  var items2 = {
    x: x2,
    y: y2,
    mode: "lines",
    line: {
      color: "#4A2756",
    },
    name: "Test line",
    hoverinfo: "name+x+y",
  };

  data.push(items2);
  // TODO: end TODO testing

  var layout = {
    xaxis: {
      title: "Months",
    },
    yaxis: {
      title: "Net worth",
    },
  };

  Plotly.newPlot("canvas_div", data, layout);
};

FI.calculate_fi();
