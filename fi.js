// fi.js
// A simple library aimed at calculating when you can achieve financial
// independence.
var FI = {};

// What version of this library are we using?
FI.version = "0.0.3";

// Return a list of query parameters in [[key1, value1], [key2, value2], ...]
// form. Numeric values will be changed to an actual Number instead of a
// string.
FI.get_query_parameters = function() {
  var query_string = window.location.search.substring(1); // income=100000&expenses=80000
  var queries = query_string.split("&"); // ["income=100000", "expenses=80000"]

  var i;
  var parameters = [];
  for (i = 0; i < queries.length; i++) {
    var query = queries[i].split("=");  // ["income", "100000"]
    // Attempt to convert the value to a number, if applicable
    // TODO: this doesn't work for "0". Number("0") evaluates to false. Compare to NaN?
    query[1] = Number(query[1]) || query[1];  // ["income", 100000]
    parameters.push(query);
  }
  return parameters;
};

// Return a list of query groups, based on the numerical naming of each query
// parameter. Parameters ending in the same number will be grouped together
// (var1, anothervar1, ...). Parameters with no ending number will also be
// grouped together (avar, somethingelse, ...). For example, the following URL
// query
//    ?income1=100000&expenses1=80000&income2=50000&expenses2=30000&a=3&b=4
// will return
//    [{income1: 100000, expenses1: 80000},
//     {income2: 50000, expenses2: 30000},
//     {a: 3, b: 4}]
FI.get_query_groups = function() {
  // TODO: is this the correct way to format the output? Will this actually
  // make it easy to incorporate user input into the form on the page?
};

// A sample calculation object that lets us determine when the user will be
// financially independent.
//
// Create a new calculation with:
//  Object.create(FI.FICalculation);
FI.FICalculation = {
  // With the exception of networth, these are all annual amounts.
  income: 100000,
  expenses: 50000,
  roi: 5,
  swr: 4,
  networth: 0,

  // Get the annual savings amount for the user
  savings: function() {
    return this.income - this.expenses;
  },

  // Your nest egg is the amount of money needed in order to maintain your
  // current lifestyle if you only lived on the returns of your investment.
  nestegg: function() {
    // If your expenses are $40k/yr and your SWR is 4%, your nest egg is $1M
    return this.expenses / (this.swr / 100);
  },

  // Return true or false if the given networth means that the user is
  // financially independent
  is_fi: function(networth) {
    return networth >= this.nestegg();
  },

  // Returns the number of years until this person becomes financially
  // independent
  years_to_fi: function() {
    return this.months_to_fi() / 12;
  },

  // Returns the number of months required for this person to become
  // financially independent
  months_to_fi: function() {
    return this.per_month().length - 1;
  },

  // Returns an array of networths per month leading up to becoming financially
  // independent
  per_month: function() {
    var networth_per_month = [];
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
};
