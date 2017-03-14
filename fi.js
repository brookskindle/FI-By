var FI = {};
FI.default_values = {
  annual_income: 100000,
  annual_spending: 60000,
  annual_savings: 40000,
  roi: 5,
  networth: 0,
  withdrawal_percent: 4,
};

FI.calculate_fi = function() {
  // Main entry point for calculating financial independence
  var values = FI.get_form_input();
  FI.set_form_defaults(values);

  var years = FI.years_to_fi(values);
  document.getElementById("years_to_fi").innerHTML = years.toFixed(2) + " years";
}

FI.get_form_input = function() {
  // Gets the user's input for calculating his time to financial independence
  var values = {};
  values.annual_income = FI.get_query_variable("annual_income") || FI.default_values.annual_income;
  values.annual_spending = FI.get_query_variable("annual_spending") || FI.default_values.annual_spending;
  values.annual_savings = FI.get_query_variable("annual_savings") || FI.default_values.annual_savings;
  values.roi = FI.get_query_variable("roi") || FI.default_values.roi;
  values.withdrawal_percent = FI.get_query_variable("withdrawal_percent") || FI.default_values.withdrawal_percent;
  values.networth = FI.get_query_variable("networth") || FI.default_values.networth;
  return values;
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

FI.set_form_defaults = function(values) {
  // Set default values on the form fields
  document.getElementById("annual_income").value = values.annual_income;
  document.getElementById("annual_spending").value = values.annual_spending;
  document.getElementById("annual_savings").value = values.annual_savings;
  document.getElementById("roi").value = values.roi;
  document.getElementById("withdrawal_percent").value = values.withdrawal_percent;
  document.getElementById("networth").value = values.networth;
}

FI.years_to_fi = function(values) {
  return FI.months_to_fi(values) / 12;
}

FI.months_to_fi = function(values) {
  var n_months = 0;
  while (!FI.is_financially_independent(values)) {
    // How much has the networth increased simply from ROI?
    values.networth *= (1 + (values.roi / 100 / 12));
    // Let's add up the savings
    values.networth += (values.annual_savings / 12);
    n_months++;
    if (n_months >= (1200)) { // FI >= 100 years
      return NaN; // safety check to prevent infinite loops
    }
  }
  return n_months;
}

FI.is_financially_independent = function(values) {
  // Return true if the user is financially independent, or false otherwise
  var nest_egg = values.annual_spending * (100 / values.withdrawal_percent);
  return values.networth >= nest_egg;
}

FI.calculate_fi();
