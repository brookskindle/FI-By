// form.js
// Code to manipulate the financial independence form

form = {};

// Create and return a new calculation form based on the most recent form
// created
form.createForm = function() {
  // How many forms do we have?
  var forms = form.getForms();
  if (forms.length === 0) {
    // No forms currently exist, create one from our template
    var newForm = document.getElementById("form0").cloneNode(true);
    newForm.className = newForm.className.replace("hidden", "");
  }
  else {
    // At least one form exists, let's copy that one
    var newForm = forms[forms.length - 1].cloneNode(true);
  }
  newForm.id = form.increment(newForm.id);


  // modify all form inputs and labels to have new ids
  var i;
  var inputs = newForm.getElementsByTagName("input");
  for (i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    input.id = form.increment(input.id);

    // Make sure that the new color and name are not the same as the previous
    // form's color and name.
    if (input.id.startsWith("color")) {
      input.value = form.randomColor();
      // Make sure the glyph also receives the color update
      $(input).closest("form").find("span.color").css("color", input.value);
    }
    else if (input.id.startsWith("name")) {
      input.value = form.increment(input.value);
      // Make sure the panel-title text correctly gets the new name as well
      $(input).closest("form").find("span.name").html(input.value);
    }
  }

  var as = newForm.getElementsByTagName("a");
  for (i = 0; i < as.length; i++) {
    as[i].href = form.increment(as[i].href);
  }

  var divs = newForm.getElementsByTagName("div");
  for (i = 0; i < divs.length; i++) {
    divs[i].id = form.increment(divs[i].id)
  }

  var labels = newForm.getElementsByTagName("label");
  for (i = 0; i < labels.length; i++) {
    labels[i].htmlFor = form.increment(labels[i].htmlFor);
  }

  return newForm;
};


// Add a new form to the webpage
form.addForm = function() {
  var f = form.createForm();
  document.getElementById("calculations").appendChild(f);
};


// Return the forms
form.getForms = function() {
  return document.getElementById("calculations").getElementsByTagName("form");
};


// Return the number of calculation forms that currently exist on the page
form.numForms = function() {
  return form.getForms().length;
};


// Increment a string based on its trailing number.
// Examples:
//  "income1" --> "income2"
//  "income10" --> "income11"
//  "income" --> "income2"
form.increment = function(string) {
  // Do we have a number at the end of the string?
  var match = string.match("[0-9]+$");
  if (match) {
    // Break string into two parts, word and num
    var num = string.slice(match.index);
    var word = string.slice(0, match.index);
    return word + (Number(num) + 1).toString();
  }
  else { // No number at the end (can't increment). Just add "2".
    return string + "2";
  }
};

// Generate a random hexadecimal color
// https://www.paulirish.com/2009/random-hex-color-code-snippets/
form.randomColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
};


// Return a list of query parameters in [[key1, value1], [key2, value2], ...]
// form. Numeric values will be changed to an actual Number instead of a
// string.
form.getQueryParameters = function() {
  var queryString = window.location.search.substring(1); // income=100000&expenses=80000
  var queries = queryString.split("&"); // ["income=100000", "expenses=80000"]

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
// number of 1, and the string "networth" has a group number of -1
form.getGroup = function(string) {
  var match = string.match("[0-9]+$");
  if (!match) {
    return -1; // no match, return -1
  }
  var group = Number(string.slice(match.index));
  return group;
};


// Return a string without the group number. IE, an input of "input13" will
// return "input"
form.withoutGroup = function(string) {
  var match = string.match("[0-9]+$");
  var base = string.slice(0, match.index);
  return base;
}


// Return a list of query groups, based on the numerical naming of each query
// parameter. Parameters ending in the same number will be grouped together
// (var1, anothervar1, ...). Parameters with no ending number will also be
// grouped together (avar, somethingelse, ...). For example, the following URL
// query
//    ?income1=100000&expenses1=80000&income2=50000&expenses2=30000&a=3&b=4
// will return
//    [
//      [
//        ["income1", 100000],
//        ["expenses1", 80000],
//      ],
//      [
//        ["income2", 50000],
//        ["expenses2", 30000],
//      ],
//    ]
form.getQueryGroups = function() {
  var params = form.getQueryParameters();
  var groups = [];
  var i;
  for (i = 0; i < params.length; i++) {
    var key = params[i][0];
    var num = form.getGroup(key)
    if (num === -1) {
      continue; // parameter doesn't have a number, skip it
    }
    if (!groups[num]) {
      // group doesn't exist, create it first
      groups[num] = [];
    }
    groups[num].push(params[i]);
  }
  return groups.filter(function(element){return element !== undefined});
};


// Uses the URL query parameters to set the values in each form.
form.createFormsFromURI = function () {
  // If the user has any query parameters set, let's make sure to grab them and
  // re-create the form appropriately.
  form.addEnoughForms();

  var p = form.getQueryParameters();
  var i;
  for (i = 0; i < p.length; i++) {
    var key = p[i][0];
    var value = p[i][1];
    var input = $("#" + key);
    input.val(decodeURIComponent(value));
    input.trigger("input"); // Simulate that this value was entered by the user
  }
};


// Add additional form calculations if the user has multiple query parameters
form.addEnoughForms = function() {
  var n = form.numForms();
  var groups = form.getQueryGroups();

  if (groups.length > n) {
    // Must add some forms, but how many?
    var remaining = groups.length - n;
    var i;
    for (i = 0; i < remaining; i++) {
      form.addForm();  // Add a calculation
    }
  }
};


// Retrieve the values in each form and perform calculations on that
form.calculate = function() {
  history.replaceState(null, null, form.buildParameters());
  form.showResults();
};


form.simulateClick = function() {
  form.calculate();
  // Scroll to the results
  $("html,body").animate({scrollTop: $("#results-header").offset().top}, 800);
};


form.showResults = function() {
  var banner = document.getElementById("results-header");
  banner.className = banner.className.replace("hidden", "");
  var container = document.getElementById("results-container");
  container.className = container.className.replace("hidden", "");
  form.writeAllResults();
  form.graphAllForms();
};


// Calculate the FI date for each scenario and display the results on a graph
form.graphAllForms = function() {
  form.initPlotly();
  var i;
  var forms = form.getForms();
  for (i = 0; i < forms.length; i++) {
    var calculation = form.calculationFromForm(forms[i]);
    var name = $(forms[i]).find("input.name").val();
    var color = $(forms[i]).find("input.color").val();
    form.graphCalculation(calculation, name, color);
  }
};


// Write a text-version of the results to the screen
form.writeAllResults = function() {
  // Clear old results
  var results = document.getElementById("results")
  while (results.hasChildNodes()) {
    results.removeChild(results.lastChild);
  }

  // Add new results
  var i;
  var forms = form.getForms();
  for (i = 0; i < forms.length; i++) {
    var result = form.resultFromForm(forms[i]);
    results.appendChild(result);
  }
};


// Return the clone of a result template, modified to be accurate for the given
// form calculation
form.resultFromForm = function(theform) {
  var calculation = form.calculationFromForm(theform);
  var result = document.getElementById("result0").cloneNode(true);
  result.removeAttribute("id");
  result.className = result.className.replace("hidden");

  var name = result.getElementsByClassName("name")[0];
  var color = result.getElementsByClassName("color")[0];
  var retirement_expenses = result.getElementsByClassName("rexpenses")[0];
  var swr = result.getElementsByClassName("swr")[0];
  var nestegg = result.getElementsByClassName("nestegg")[0];
  var savings = result.getElementsByClassName("savings")[0];
  var roi = result.getElementsByClassName("roi")[0];
  var years = result.getElementsByClassName("years")[0];

  name.innerHTML = $(theform).find("input.name").val();
  color.style.color = $(theform).find("input.color").val();
  retirement_expenses.innerHTML = calculation.retirement_expenses.toLocaleString();
  swr.innerHTML = calculation.swr;
  nestegg.innerHTML = calculation.nestegg().toLocaleString();
  savings.innerHTML = calculation.savings().toLocaleString();
  roi.innerHTML = calculation.roi;
  years.innerHTML = calculation.years_to_fi().toFixed(1);
  return result;
};


// Build and return the string of query parameters that represents the
// calculations the user has created.
form.buildParameters = function() {
  var i;
  var parameters = "?";
  var forms = form.getForms();
  for (i = 0; i < forms.length; i++) {
    var inputs = forms[i].getElementsByTagName("input");
    var k;
    for (k = 0; k < inputs.length; k++) {
      var key = form.withoutGroup(inputs[k].id) + String(i+1);
      var value = encodeURIComponent(inputs[k].value);
      parameters += key + "=" + value + "&";
    }
  }
  parameters = parameters.slice(0, -1); // lop off trailing "&"
  return parameters;
};


// Initialize plotly so we can graph
form.initPlotly = function() {
  var layout = {
    xaxis: {
      title: "Years",
      hoverformat: ".1f",
    },
    yaxis: {
      title: "Percent of expenses covered",
    },
    title: "Time to financial independence",
  };
  Plotly.newPlot("canvas_div", [], layout);
};


// Return a FI calculation from a given HTML form
form.calculationFromForm = function(f) {
  var calc = Object.create(FI.FICalculation);
  calc.income = Number(f.getElementsByClassName("income")[0].value);
  calc.expenses = Number(f.getElementsByClassName("expenses")[0].value);
  calc.retirement_expenses = Number(f.getElementsByClassName("rexpenses")[0].value);
  calc.roi = Number(f.getElementsByClassName("roi")[0].value);
  calc.swr = Number(f.getElementsByClassName("swr")[0].value);
  calc.networth = Number(f.getElementsByClassName("networth")[0].value);
  return calc;
};


// Plot a FI calculation on a graph
form.graphCalculation = function(calculation, name, color) {
  var networths = calculation.per_month();
  var x = [];
  var y = [];
  var i = 0;
  var nestegg = calculation.nestegg();
  for (i = 0; i < networths.length; i++) {
    x.push((i/12));
    // How much of our portfolio has been funded so far?
    var percent_funded = networths[i] / nestegg * 100;
    y.push(percent_funded);
  }

  var data = {
    x: x,
    y: y,
    mode: "lines",
    line: {
      color: color,
    },
    name: name,
    hoverinfo: "name+x+y",
    legendgroup: name,
  };

  Plotly.addTraces("canvas_div", [data]);
};


document.getElementById("add").onclick = form.addForm;
document.getElementById("calculate").onclick = form.simulateClick;
if (window.location.search !== "") {
  form.createFormsFromURI();
  form.simulateClick();
}
else {
  form.addForm();
}
window.onresize = function () {
  // Redraw the graph
  form.graphAllForms();
};
