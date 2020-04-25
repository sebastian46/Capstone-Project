// Displays all 12 inputs in one place

// We use this variable to know how fast the graph should update
// 1000 = 1s
var updateEvery_ = 1000;

// alpha_two comes from HTML file
var alpha = [alpha_two];

// setup the bar graph
/*
var setup = d3
  .marcon()
  .top(50)
  .bottom(70)
  .left(10)
  .right(30)
  .width(window.innerWidth * .55)
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

//width = width/2;

// create x-axis
var x = d3
  .scaleBand()
  .rangeRound([0, width])
  // each bar graph is labeled with their sensor's name
  // since this is the individual graph, only 1 bar will be shown
  .domain(alpha)
  .padding(0.2);

// create y-axis
var y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([min_sensor_values, max_sensor_values]);

// following lines are for the scale of x/y axis
var x_axis = d3.axisBottom(x);

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

// graph gets updated every updateEvery_ ms
d3.interval(function() {
  var tempStore = [];
  db_data().then(x => {
    tempStore = x;
    // store the value in HTML so page live updates it
    document.getElementById("rnd").innerHTML = Number(tempStore[0].value).toFixed(storeDecimalPlace);
    redraw(tempStore);
  });
}, updateEvery_);

// this is what draws the bar graph
function redraw(data) {
  // name and value respectively 
  var x_var = Object.keys(data[0])[0],
    y_var = Object.keys(data[0])[1];

  /*y_axis.tickFormat(function(d, i, ticks) {
    return i == ticks.length - 1 ? d + " " + y_var + "s" : d;
  });*/

  // join
  var bar = svg.selectAll(".bar").data(data, function(d) {
    return d[x_var];
  }); // for bar

  /*var amount = svg.selectAll(".amount").data(data, function(d) {
    return d[x_var];
  });*/ // for number inside bar

  // update bar height
  bar
    .transition()
    .attr("y", function(d) {
      return y(d[y_var]);
    })
    .attr("height", function(d) {
      //console.log(y(d[y_var]));
      return height - y(d[y_var]);
    });

  /*amount
    .transition()
    .text(function(d) {
      return d[y_var];
    });*/ // updates value

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
    }) // initial flip
    .attr("width", x.bandwidth()) // actual bar
    .attr("height", function(d) {
      return height - y(d[y_var]);
    }) // initial fill
    .attr("fill", function(d) {
      return color(d[x_var]);
    }); // chooses color
}

// initializes value of bar to 0
function random_data() {
  return alpha.map(function(d) {
    return {
      name: d,
      value: 0 
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
      tempStore[0] = Number(data_[sensorNum - 1].value);
      // checks if value is between the low and high alarm
      // displays alert if not
      if(tempStore[0] < low_alarm_value){
        setTimeout(function(){
          if(alert('Value read is lower than Low Alarm value!\nClick OK to reload page')){}
          else    window.location.reload(); 
        }, 1500);
      }
      if(tempStore[0] > high_alarm_value){
        setTimeout(function(){
          if(alert('Value read is higher than High Alarm value!\nClick OK to reload page')){}
          else    window.location.reload(); 
        }, 1500);
      }
      // if the value read is less than the min sensor value
      // make the percentage 0
      if(Number(data_[sensorNum - 1].value) < min_sensor_values){
        tempStore[0] = Number(min_sensor_values);
      }
      // if the value read is larger than the max sensor value
      // make the percentage 100
      else if(Number(data_[sensorNum - 1].value) > max_sensor_values){
        tempStore[0] = Number(max_sensor_values);
      }
      // else, convert to percentage
      else{
        var val = Number(data_[sensorNum - 1].value);
        // input gets converted to percentage and stored
        tempStore[0] = val;
      }
    }
  };
  // we return the resolved promise
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempStore);
    }, updateEvery_);
  });
}

// waits for sensor data to arrive and returns the value
async function db_data() {
  var tempStore = [];
  tempStore = await getData();
  var returnVal = sensor_value_(tempStore);
  return returnVal;
}

// returns value of sensor
function sensor_value_(tempStore) {
  // tempStore has the value from database
  // alpha has the name of the sensor
  // this maps the name and value together and returns to db_data_2()
  return alpha.map(function(d) {
    return {
      name: d,
      value: tempStore[alpha.indexOf(d)] 
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
