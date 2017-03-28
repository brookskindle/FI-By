// form.js
// Code to manipulate the financial independence form

Form = {};

// Add a new set of calculations to the form.
Form.add = function() {
  // Find the last calculation and copy it
  var calculations = document.getElementById("calculations");
  var nforms = document.forms.length;
  var last_calculation = document.forms[nforms - 1];
  var new_calculation = last_calculation.cloneNode(true);

  // modify all form inputs and labels to have new ids
  var i;
  var inputs = new_calculation.getElementsByTagName("input");
  for (i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    input.id = Form.increment(input.id);

    // if the color input, randomize
    if (input.id.startsWith("color")) {
      input.value = Form.random_hex();
    }
    else if (input.id.startsWith("name")) {
      input.value = Form.increment(input.value);
    }
  }

  var labels = new_calculation.getElementsByTagName("label");
  for (i = 0; i < labels.length; i++) {
    var label = labels[i];
    label.htmlFor = Form.increment(label.htmlFor);
  }

  // Add our new form
  calculations.appendChild(new_calculation);
};


// Determine how many calculations we currently have
Form.n_calculations = function() {
  return document.forms.length;
};


// Return a new incremented string. IE "income1" will return "income2"
// "income" will return "income1"
Form.increment = function(string) {
  // Do we have a number at the end of the string?
  var match = string.match("[0-9]+$");
  if (match) {
    // Break string into two parts, word and num
    var num = string.slice(match.index);
    var word = string.slice(0, match.index);
    return word + (Number(num) + 1).toString();
  }
  else { // No match, just add "2" to the end of it.
    return string + "2";
  }
};

// From: https://www.paulirish.com/2009/random-hex-color-code-snippets/
Form.random_hex = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
};


document.getElementById("add").onclick = Form.add;
