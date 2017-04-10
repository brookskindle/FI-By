// Requires the fi.js library to be loaded independently

FI.graph_fi_plotly = function() {
  var groups = Params.get_query_groups();
  if (groups.length === 0) {
    return; // No query parameters, don't do anything
  }
  var i;
  var data = [];

  for (i = 0; i < groups.length; i++) {
    var group = groups[i];
    var calculation = Object.create(FI.FICalculation);
    var k;
    for (k = 0; k < group.length; k++) {
      var key = group[k][0];
      var value = group[k][1];
      var color;
      var name;
      if (key.startsWith("income")) {
        calculation.income = value;
      }
      else if (key.startsWith("expenses")) {
        calculation.expenses = value;
      }
      else if (key.startsWith("roi")) {
        calculation.roi = value;
      }
      else if (key.startsWith("swr")) {
        calculation.swr = value;
      }
      else if (key.startsWith("networth")) {
        calculation.networth = value;
      }
      else if (key.startsWith("color")) {
        color = value;
      }
      else if (key.startsWith("name")) {
        name = value;
      }
    } // for k
    var networths = calculation.per_month();

    var x = [];
    var y = [];
    var j;
    for (j = 0; j < networths.length; j++) {
      x.push(j);
      var networth = networths[j].toFixed(2);
      y.push(networths[j].toFixed(2));
    }

    var items = {
      x: x,
      y: y,
      mode: "lines",
      line: {
        color: color,
      },
      name: name,
      hoverinfo: "name+x+y",
    };

    data.push(items);

  } // for i
  var layout = {
    xaxis: {
      title: "Months",
    },
    yaxis: {
      title: "Net worth",
    },
  };
  Plotly.newPlot("canvas_div", data, layout);
};

FI.graph_fi_plotly();
