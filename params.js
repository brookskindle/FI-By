// params.js
// Contains logic to grab and manipulate the URL search parameters
Params = {};

// Return a list of query parameters in [[key1, value1], [key2, value2], ...]
// form. Numeric values will be changed to an actual Number instead of a
// string.
Params.get_query_parameters = function() {
  var query_string = window.location.search.substring(1); // income=100000&expenses=80000
  var queries = query_string.split("&"); // ["income=100000", "expenses=80000"]

  if (queries.length === 1 && queries[0] === "") { // No queries given
    return [];
  }

  var i;
  var parameters = [];
  for (i = 0; i < queries.length; i++) {
    var query = queries[i].split("=");  // ["income", "100000"]
    query[1] = query[1].replace("%23", "#");  // Fix hex string encoding
    // Attempt to convert the value to a number, if applicable
    var number = Number(query[1]);
    if (!isNaN(number)) {
      // Conversion to number successful. Replace value with a Number version
      query[1] = number;
    }
    parameters.push(query);
  }
  return parameters;
};


// Return the group number associated with a given string for example, the
// string "asdf2" has a group number of 2. The string "income1" has a group
// number of 1, and the string "networth" has a group number of 0, as does
// "networth0"
Params.get_group = function(string) {
  var match = string.match("[0-9]+$");
  if (!match) {
    return 0; // no match, return the default group 0
  }
  var group = Number(string.slice(match.index));
  return group;
};


// Return a list of query groups, based on the numerical naming of each query
// parameter. Parameters ending in the same number will be grouped together
// (var1, anothervar1, ...). Parameters with no ending number will also be
// grouped together (avar, somethingelse, ...). For example, the following URL
// query
//    ?income1=100000&expenses1=80000&income2=50000&expenses2=30000&a=3&b=4
// will return
//    [
//      [
//        ["a", 3],
//        ["b", 4],
//      ],
//      [
//        ["income1", 100000],
//        ["expenses1", 80000],
//      ],
//      [
//        ["income2", 50000],
//        ["expenses2", 30000],
//      ],
//    ]
Params.get_query_groups = function() {
  var params = Params.get_query_parameters();
  var groups = [];
  var i;
  for (i = 0; i < params.length; i++) {
    var param_key = params[i][0];
    var group_num = Params.get_group(param_key)
    if (!groups[group_num]) {
      // group doesn't exist, create it first
      groups[group_num] = [];
    }
    groups[group_num].push(params[i]);
  }
  return groups.filter(function(element){return element !== undefined});
};


Params.set_form_defaults = function () {
  // If the user has any query parameters set, let's make sure to grab them and
  // re-create the form appropriately.
  Params.add_enough_forms();

  var p = Params.get_query_parameters();
  var i;
  for (i = 0; i < p.length; i++) {
    var key = p[i][0];
    var value = p[i][1];
    document.getElementById(key).value = value;
  }
};


// Add additional form calculations if the user has multiple query parameters
Params.add_enough_forms = function() {
  var n = Form.n_calculations();
  var groups = Params.get_query_groups();

  if (groups.length > n) {
    // Must add some forms, but how many?
    var remaining = groups.length - n;
    var i;
    for (i = 0; i < remaining; i++) {
      Form.add();  // Add a calculation
    }
  }
};


Params.set_form_defaults();
