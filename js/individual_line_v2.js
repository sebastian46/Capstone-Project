var n_2 = 101
var data_3 = [];
for(var i = 0; i < 100; i++){
  data_3[i] = 0;
}
var svg_3 = d3.select("svg"),
    margin_2 = {top_3: 20, right_3: 20, bottom_3: 20, left_3: 40},
    width_2 = +svg_3.attr("width") - margin_2.left_3 - margin_2.right_3,
    height_3 = +svg_3.attr("height") - margin_2.top_3 - margin_2.bottom_3;
    g_3 = svg_3.append("g").attr("transform", "translate(" + margin_2.left_3 + "," + margin_2.top_3 + ")");

var x_3 = d3.scaleLinear()
    .domain([0, n_2 - 1])
    .range([0, width_2]);

var y_3 = d3.scaleLinear()
    .domain([0, 10])
    .range([height_3, 0]);

var y_axis_2 = d3.axisRight(y_3)
  .tickSize(width_2)

var line_3 = d3.line()
    .x(function(d, i) { return x_3(i); })
    .y(function(d, i) { return y_3(d); });

g_3.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width_2)
    .attr("height", height_3);

g_3.append("g")
    //.attr("class", "axis axis--x")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y_3(0) + ")")
    .call(d3.axisBottom(x_3));

g_3.append("g")
    //.attr("class", "axis axis--y")
    .attr("class", "y axis")
    .call(d3.axisLeft(y_3));

g_3.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data_3)
    .attr("class", "line")
  .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .on("start", tick_3);

function make_x_gridlines(){
  return d3.axisBottom(x_3).ticks(10);
}
function make_y_gridlines(){
  return d3.axisLeft(y_3).ticks(10);
}

var circleArea = g_3.append('g');

function tick_3() {
  // Push a new data point onto the back.
  // this updates at the same time as bar graph
  db_data_2().then(x=>{ data_3.push(x[0].value); });
  
  // plotting point
  circleArea.selectAll('circle').remove();
  g_3.selectAll("path").remove();
  g_3.selectAll("g").remove();

  g_3.append("g")
    //.attr("class", "axis axis--x")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y_3(0) + ")")
    .call(d3.axisBottom(x_3));

  g_3.append("g")
    //.attr("class", "axis axis--y")
    .attr("class", "y axis")
    .call(d3.axisLeft(y_3));

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

  circleArea.selectAll('circle')
  		.data(data_3)
   	  .enter()
      .append('circle')
      .attr('r',4)
      .attr('fill','black')
      .attr('transform',function(d,i){ return 'translate('+x_3(i)+','+y_3(d)+')';}); 
  
  circleArea.selectAll('circle').transition().duration(2000)
    .ease(d3.easeLinear)
    .attr('transform',function(d,i){  
      if(x_3(i )<=0) d3.select(this).remove();
      return 'translate('+x_3(i-1)+','+y_3(d)+')';
    }); 

  // add line
  g_3.append("path")
    .attr("class", "line")
    .attr("d", line_3(data_3))
    .attr("transform", null)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("transform", "translate(" + x_3(-1)  + ")")
    //.transition()
  
  // Slide it to the left.
  d3.active(this)
      .attr("transform", "translate(" + x_3(-1) + ",0)")
    .transition()
      .on("start", tick_3);
  
  // Pop the old data point off the front.
  data_3.shift();
}

function getData_2(){
  var ajax_two = new XMLHttpRequest();
  ajax_two.open("GET", "../../403/php/getValues.php", true);
  ajax_two.send();
  var tempStore = []
  
  ajax_two.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //alert(this.responseText);
      var data_ = JSON.parse(this.responseText);
      tempStore[0]= (Number(data_[sensorNum-1].value));
      console.log(tempStore[0]);
    };
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempStore);
    }, 1000);
  });
}

async function db_data_2() {
  var tempStore = []
  tempStore = await getData_2();
  var returnVal = testingonly_2(tempStore);
  return returnVal;
}

function testingonly_2(tempStore){
  return alpha.map(function(d){ 
    return {
      name: d,
      value: tempStore[alpha.indexOf(d)]//Math.floor(Math.random()*(7-3))+3
    }
  });
}
