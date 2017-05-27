// fi.js
// A simple library aimed at calculating when you can achieve financial
// independence.
var FI = {};

// What version of this library are we using?
FI.version = "0.0.3";

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
  retirement_expenses: 50000,

  // Get the annual savings amount for the user
  savings: function() {
    return this.income - this.expenses;
  },

  // Your nest egg is the amount of money needed in order to maintain your
  // current lifestyle if you only lived on the returns of your investment.
  nestegg: function() {
    // If your expenses are $40k/yr and your SWR is 4%, your nest egg is $1M
    return this.retirement_expenses / (this.swr / 100);
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
