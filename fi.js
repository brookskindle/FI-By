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

  is_fi: function(values) {
    return this.networth >= this.nestegg();
  },

  years_to_fi: function() {
    return this.months_to_fi() / 12;
  },

  months_to_fi: function() {
    var n_months = 0;
    while (!this.is_fi()) {
      // How much has the networth increased simply from ROI?
      this.networth *= (1 + (this.roi / 100 / 12));
      // Let's add up the savings
      this.networth += (this.savings() / 12);
      n_months++;
      if (n_months >= (1200)) { // FI >= 100 years
        return NaN; // safety check to prevent infinite loops
      }
    }
    return n_months;
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

FI.calculate_fi();
