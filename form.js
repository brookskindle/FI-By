// form.js
// Code to manipulate the financial independence form

Form = {};

// Add a new set of calculations to the form.
Form.add = function() {
  // Find the last calculation and copy it
  var calculations = document.getElementById("calculations");
  var n = calculations.children.length;
  var last_calculation = calculations.children[n - 1];

  var new_calculation = last_calculation.cloneNode(true);

  var i;
  for (i = 0; i < new_calculation.children.length; i++) {
    var child = new_calculation.children[i];
    if (child.htmlFor) {
      child.htmlFor = Form.increment(child.htmlFor);
    }
    if (child.id) {
      child.id = Form.increment(child.id);
    }
    if (child.name) {
      child.name = Form.increment(child.name);
    }
    if (child.id && child.id.startsWith("label")) {
      child.value = Form.increment(child.value);
    }
    if (child.id.startsWith("color")) {
      child.value = Form.random_hex();
    }
  }
  calculations.appendChild(new_calculation);
};


// Return a new incremented string. IE "income1" will return "income2"
// "income" will return "income1"
// TODO: this won't work correctly if we have a number in the middle and at the
// end, IE "income234stuff35"
Form.increment = function(string) {
  // Do we have a number at the end of the string?
  var match = string.match("[0-9]+");
  if (match && string.endsWith(match[0])) {
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
