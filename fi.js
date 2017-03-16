var FI = {};

// What version of this library are we using?
FI.version = "0.0.1";

// A sample calculation object that lets us determine when the user will be
// financially independent
FI.FICalculation = {
  // With the exception of networth, these are all annual amounts.
  income: 100000,
  expenses: 50000,
  roi: 5,
  swr: 4,
  networth: 0,

  savings: function() {
    return this.income - this.expenses;
  },

  nestegg: function() {
    // If your expenses are $40k/yr and your SWR is 4%, your nest egg is $1M
    return this.expenses / (this.swr / 100);
  },

  is_fi: function(networth) {
    return networth >= this.nestegg();
  },

  years_to_fi: function() {
    return this.months_to_fi() / 12;
  },

  months_to_fi: function() {
    var n_months = 0;
    var cur_networth = this.networth;
    while (!this.is_fi(cur_networth)) {
      // How much has the networth increased simply from ROI?
      cur_networth *= (1 + (this.roi / 100 / 12));
      // Let's add up the savings
      cur_networth += (this.savings() / 12);
      n_months++;
      if (n_months >= (1200)) { // FI >= 100 years
        return NaN; // safety check to prevent infinite loops
      }
    }
    return n_months;
  },

  per_month: function() {
    var networth_per_month = [];
    // TODO: refactor this and the months_to_fi function
    var cur_networth = this.networth;
    networth_per_month.push(cur_networth); // start at month 0

    while (!this.is_fi(cur_networth)) {
      // How much has the networth increased simply from ROI?
      cur_networth *= (1 + (this.roi / 100 / 12));
      // Let's add up the savings
      cur_networth += (this.savings() / 12);
      networth_per_month.push(cur_networth);
      if (networth_per_month.length >= (1200)) { // FI >= 100 years
        return NaN; // safety check to prevent infinite loops
      }
    }
    return networth_per_month;
  },
}

////////////////////////////////////////////////////////
//Here begins the logic to interact with the web page //
////////////////////////////////////////////////////////

FI.calculate_fi = function() {
  // Main entry point for the program
  var calculation = FI.get_user_calculation();
  FI.set_form_defaults(calculation);

  var years = calculation.years_to_fi();
  document.getElementById("years_to_fi").innerHTML = years.toFixed(2) + " years";

  networth_by_month = calculation.per_month();
  FI.graph_fi(networth_by_month);
}

FI.get_user_calculation = function() {
  // Gets the user's input for calculating his time to financial independence
  var calc = Object.create(FI.FICalculation);

  calc.income = FI.get_query_variable("income") || calc.income;
  calc.expenses = FI.get_query_variable("expenses") || calc.expenses;
  calc.roi = FI.get_query_variable("roi") || calc.roi;
  calc.swr = FI.get_query_variable("swr") || calc.swr;
  calc.networth = FI.get_query_variable("networth") || calc.networth;

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

//exploratory vis.js examples
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
    });
  }

  var dataset = new vis.DataSet(items);
  var options = {
    //start: "2013-06-11",
    //end: "2016-08-04",
    //moveable: false,
  };

  //actually graph it
  var container = document.getElementById("canvas_div");
  var graph2d = new vis.Graph2d(container, dataset, options);
};

FI.calculate_fi();
