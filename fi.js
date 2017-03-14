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

  var years = FI.years_to_fi(annual_savings, annual_spending, networth);
  document.getElementById("years_to_fi").innerHTML = years + " years";
}

FI.get_form_input = function() {
  // Gets the user's input for calculating his time to financial independence
  var values = {};
  // TODO: grab these from GET parameters or default to some value
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

FI.years_to_fi = function(annual_savings, annual_spending, current_net_worth) {
  return "Unknown, this function hasn't been completed yet";
}

FI.calculate_fi();
