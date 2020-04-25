// Displays all 12 inputs in one place
// Reads from database
// Still need to adjust graph to have percentages instead of numbers

// We use this variable to know how fast the graph should update
// 1000 = 1s
var updateEverySeconds = 1000;

// These 2 variables allow the user to have same name sensors. 
// Each letter in alpha is mapped with a value in the name array (alpha_two)
var alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];

var myTicks = {
  a: alpha_two[0],
  b: alpha_two[1],
  c: alpha_two[2],
  d: alpha_two[3],
  e: alpha_two[4],
  f: alpha_two[5],
  g: alpha_two[6],
  h: alpha_two[7],
  i: alpha_two[8],
  j: alpha_two[9],
  k: alpha_two[10],
  l: alpha_two[11]
};

/*
// setup the bar graph
var setup = d3
  .marcon()
  .top(20)
  .bottom(20)
  .left(100)
  .right(120)
  .width(window.innerWidth)
  .height(window.innerHeight * 0.6);

// render it
setup.render();

// give it a width, height, and begin setting up the svg 
var width = setup.innerWidth(),
  height = setup.innerHeight(),
  svg = setup.svg();
*/
var svg = d3.select("#svg1"),
  margin = { top: 20, right: 20, bottom: 20, left: 40 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")"
    );
// create x-axis
var x = d3
  .scaleBand()
  .rangeRound([0, width])
  // each bar graph is labeled with their sensor's name
  .domain(alpha) 
  .padding(0.2);

// create y-axis
var y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, 100]);

// following lines are for the scale of x/y axis
var x_axis = d3.axisBottom(x).tickFormat(d => myTicks[d]); // allows same name inputs

var y_axis = d3.axisRight(y).tickSize(width);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis);

svg
  .append("g")
  .attr("class", "y axis")
  .call(customYAxis);

// colors for the bar graph
var color = d3.scaleOrdinal([
  "#66c2a5",
  "#fc8d62",
  "#8da0cb",
  "#e78ac3",
  "#a6d854",
  "#ffd92f",
  "#e5c494"
]);

// to initialize the graph
// when you open page, you'll notice that the graph is set at 0, that is because of this
redraw(random_data());

// graph gets updated every updateEverySeconds ms
d3.interval(function() {
  var tempStore = [];
  db_data().then(x => {
    tempStore = x;
    for (var i = 0; i < 12; i++) {
      // store the values in HTML so page live updates them
      // this (commented) line is for no rounding
      // document.getElementById("value" + i).innerHTML = tempStore[i].value;
      // this line returns the value rounded to the decimal_places decimals
      document.getElementById("value" + i).innerHTML = Number(tempStore[i].value).toFixed(storeDecimalPlaces[i]);
    }
    redraw(tempStore);
  });
}, updateEverySeconds);


// this is what draws the bar graph
function redraw(data) {
  // name and value respectively 
  var x_var = Object.keys(data[0])[0],
    y_var = Object.keys(data[0])[1];

 /* y_axis.tickFormat(function(d, i, ticks) {
    return i == ticks.length - 1 ? d + " " + y_var + "s" : d;
  });
  d3.select(".y.axis").call(customYAxis);*/

  // join
  var bar = svg.selectAll(".bar").data(data, function(d) {
    return d[x_var];
  }); // draws bar

  /*var amount = svg.selectAll(".amount").data(data, function(d) {
    return d[x_var];
  }); */// display count

  // update bar height
  bar
    .transition()
    .attr("y", function(d) {
      return y(d[y_var]);
    })
    .attr("height", function(d) {
      return height - y(d[y_var]);
    });

  /*amount
    .transition()
    .attr("y", function(d) {
      return y(d[y_var]);
    })
    .text(function(d) {
      return d[y_var];
    });*/

  // display the bar
  bar
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d[x_var]);
    }) // adjust width
    .attr("y", function(d) {
      return y(d[y_var]);
    }) // flip
    .attr("width", x.bandwidth()) // actual bar
    .attr("height", function(d) {
      return height - y(d[y_var]);
    }) // fill 
    .attr("fill", function(d) {
      return color(d[x_var]);
    }); // choose color
}

// initializes value of bar to 0
function random_data() {
  return alpha.map(function(d) {
    return {
      name: d,
      value: 0 //(Math.random()*(7-3))+3
    };
  });
}
/*
  The following functions had to be executed a certain way, which is why the second
  function is asyncronous.

  db_data() is called, but it cannot pass the tempStore line until getData() is completed.
  
  If this does not happen, then it will send a null value to the graph and cause an error

*/
function getData() {
  // this part is the same as usual. Get values from PHP, parse, and then store in array
  var ajax_two = new XMLHttpRequest();
  ajax_two.open("GET", "../../403/php/getValues.php", true);
  ajax_two.send();
  var tempStore = [];

  ajax_two.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data_ = JSON.parse(this.responseText);
      for (var a = 0; a < data_.length; a++) {
        // if the value read is less than the min sensor value
        // make the percentage 0
        if(Number(data_[a].value) < min_sensor_values[a]){
          tempStore[a] = 0;
        }
        // if the value read is larger than the max sensor value
        // make the percentage 100
        else if(Number(data_[a].value) > max_sensor_values[a]){
          tempStore[a] = 100;
        }
        // else, convert to percentage
        else{
          var val = Number(data_[a].value);
          // input gets converted to percentage and stored
          tempStore[a] = (val/max_sensor_values[a])*100;
        }
      }
    }
  };
  // we return the resolved promise
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempStore);
    }, updateEverySeconds/2);
  });
}

// waits for sensor data to arrive and returns the value
async function db_data() {
  var tempStore = [];
  tempStore = await getData();
  var returnVal = sensor_value(tempStore);
  return returnVal;
}

// returns value of sensor
function sensor_value(tempStore) {
  // tempStore has the value from database
  // alpha has the name of the sensor
  // this maps the name and value together and returns to db_data_2()
  return alpha.map(function(d) {
    return {
      name: d,
      value: tempStore[alpha.indexOf(d)] //Math.floor(Math.random()*(7-3))+3
    };
  });
}

// y axis customization. adds gridlines
function customYAxis(g) {
  g.call(y_axis);
  g.selectAll(".tick text")
    .attr("x", 4)
    .attr("dy", -4);
}
