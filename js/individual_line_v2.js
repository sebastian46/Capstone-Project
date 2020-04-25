// Sets how fast the line graph gets updates
// 1000 = 1s
var updateEvery = 1000;
// Stores 101 values (this is only so the 100 shows up on the x-axis)
var n_2 = 101;
var data_3 = [];
for (var i = 0; i < 101; i++) {
  // populate with 0s
  data_3[i] = min_sensor_values;//(Math.random()*(10));
}
// setup svg
var svg_3 = d3.select("svg"),
  margin_2 = { top_3: 20, right_3: 20, bottom_3: 20, left_3: 40 },
  width_2 = +svg_3.attr("width") - margin_2.left_3 - margin_2.right_3,
  height_3 = +svg_3.attr("height") - margin_2.top_3 - margin_2.bottom_3,
  g_3 = svg_3
    .append("g")
    .attr(
      "transform",
      "translate(" + margin_2.left_3 + "," + margin_2.top_3 + ")"
    );

// scale of the x-axis
var x_3 = d3
  .scaleLinear()
  .domain([0, n_2 - 1])
  .range([0, width_2]);

// scale of the y-axis
var y_3 = d3
  .scaleLinear()
  .domain([min_sensor_values, max_sensor_values])
  .range([height_3, 0]);

// to create the line's position when graphing
var line_3 = d3
  .line()
  .x(function(d, i) {
    return x_3(i);
  })
  .y(function(d, i) {
    return y_3(d);
  });

// Where line gets clipped (at edge)
g_3
  .append("defs")
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width_2)
  .attr("height", height_3);

// to create x-axis labels
g_3
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + y_3(0) + ")")
  .call(d3.axisBottom(x_3));

// create y-axis labels
g_3
  .append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(y_3));

// for animation
// updates the line
g_3
  .append("g")
  .attr("clip-path", "url(#clip)")
  .append("path")
  .datum(data_3)
  .attr("class", "line")
  .transition()
  .duration(updateEvery)
  .ease(d3.easeLinear)
  .on("start", tick_3);

// these next two are to make the gridlines
g_3.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0,"+ height_3 +")")
    .call(make_x_gridlines()
      .tickSize(-height_3)
      .tickFormat("")
    )

g_3.append("g")     
  .attr("class", "grid")
  .call(make_y_gridlines()
    .tickSize(-width_2)
    .tickFormat("")
)

// every 10 ticks, create label (for x and y axis)
function make_x_gridlines(){
  return d3.axisBottom(x_3).ticks(10);
}
function make_y_gridlines(){
  return d3.axisLeft(y_3).ticks(10);
}

// this is what draws the line
function tick_3() {

  // Push a new data point onto the back.
  // this updates at the same time as bar graph (However, there is a bit of lag)
  db_data_2().then(x => {
    data_3.push(x[0].value);
  });

  // draw line
  d3.select(this)
    .attr("d", line_3(data_3))
    .attr("transform", null);

  // Slide it to the left.
  d3.active(this)
    .attr("transform", "translate(" + x_3(-1) + ",0)")
    .transition()
    .on("start", tick_3);

  // pop 1st value in array to make room for new one
  data_3.shift();
}

/*
  The following functions had to be executed a certain way, which is why the second
  function is asyncronous.

  db_data_2() is called, but it cannot pass the tempStore line until getData_2 is completed.

  If this does not happen, then it will send a null value to the graph and cause an error

*/
function getData_2() {
  // this part is the same as usual. Get values from PHP, parse, and then store in array
  var ajax_two = new XMLHttpRequest();
  ajax_two.open("GET", "../../403/php/getValues.php", true);
  ajax_two.send();
  var tempStore = [];

  ajax_two.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data_ = JSON.parse(this.responseText);
      tempStore[0] = Number(data_[sensorNum - 1].value);
      /*if(tempStore[0] < low_alarm_value){
        if(alert('Value read is lower than Low Alarm value!\nClick OK to reload page')){}
        else    window.location.reload(); 
      }
      if(tempStore[0] > high_alarm_value){
        if(alert('Value read is higher than High Alarm value!\nClick OK to reload page')){}
        else    window.location.reload(); 
      }*/
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
    }, updateEvery/2);
  });
}

// waits for sensor data to arrive and returns the value
async function db_data_2() {
  var tempStore = [];
  tempStore = await getData_2();
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
      value: tempStore[alpha.indexOf(d)] 
    };
  });
}
