// Displays all 12 inputs in one place

var alpha = 
  [alpha_two];

  console.log(alpha);

var setup = d3.marcon()
  .top(50)
  .bottom(70)
  .left(10)
  .right(30)
  .width(window.innerWidth)
  .height(window.innerHeight*.6);

setup.render();

var width = setup.innerWidth(), height = setup.innerHeight(), svg = setup.svg();

var x = d3.scaleBand()
  .rangeRound([0, width])
  .domain(alpha)
  .padding(.2);

var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 10]);

var x_axis = d3.axisBottom(x);

var y_axis = d3.axisRight(y)
  .tickSize(width)

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis);

svg.append("g")
  .attr("class", "y axis")
  .call(customYAxis);

var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"]);

redraw(random_data());

d3.interval(function(){
  var tempStore = []
  db_data().then(x=>{ 
    tempStore = x;
    //console.log(tempStore[0].value);
    document.getElementById('rnd').innerHTML = tempStore[0].value; 
    redraw(tempStore);
    //document.getElementById('rnd').innerHTML = tempStore[0]; 
  });
  //redraw(random_data());
  }, 2000);

function redraw(data){

  var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];

  y_axis.tickFormat(function(d, i, ticks){ return i == ticks.length - 1 ? d + " " + y_var + "s" : d; });
 // d3.select(".y.axis").call(customYAxis);

  // join
  var bar = svg.selectAll(".bar")
    .data(data, function(d){ return d[x_var]; }); // for bar

  var amount = svg.selectAll(".amount")
    .data(data, function(d){ return d[x_var]; }); // for number inside bar

  // update bar/number height
  bar
    .transition()
    .attr("y", function(d){ return y(d[y_var]); })
    .attr("height", function(d){ return height - y(d[y_var]); });

  // editing this part for number
  amount
    .transition()
    //.attr("y", function(d){ return y(d[y_var]); }) // places number at y value
    .text(function(d){ return d[y_var]; }); // updates value

  // print out value in data
  /*var tempVal;
  tempVal = data;
  currValue = tempVal.map(function(a) {return a.value;});*/
  /*amount.enter().append("text")
    .attr("class", "amount")
    .text(function(d){ return d[y_var]; });*/

  // display the bar/number
  bar.enter().append("rect")
    .attr("class", "bar") // not too sure but it works
    .attr("x", function(d){ return x(d[x_var]); }) // adjust width
    .attr("y", function(d){ return y(d[y_var]); }) // initial flip
    .attr("width", x.bandwidth()) // actual bar
    .attr("height", function(d){ return height - y(d[y_var]); }) // initial fill
    .attr("fill", function(d){ return color(d[x_var]); }); // chooses color

  // this is displayed 
  /*amount.enter().append("text")
  .attr("class", "amount")
  .attr("x", function(d){ return x(d[x_var]) + x.bandwidth() / 2; })
  .attr("y", function(d){ return y(d[y_var]); })
  .attr("dy", 16)
  .text(function(d){ return d[y_var]; });*/

}

/*function rand() {
  var randVal = Math.random()*(7-3)+3
  return randVal;
}*/

function random_data(){
  return alpha.map(function(d){
    return {
      name: d,
      value: 0//(Math.random()*(7-3))+3
    }
  });
}


function getData(){
  var ajax_two = new XMLHttpRequest();
  ajax_two.open("GET", "../../403/php/getValues.php", true);
  ajax_two.send();
  var tempStore = []
  
  ajax_two.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //alert(this.responseText);
      var data_ = JSON.parse(this.responseText);
      tempStore[0]= (Number(data_[sensorNum-1].value));
    };
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempStore);
      //document.getElementById('rnd').innerHTML = tempStore[0];
    }, 2000);
  });
}

async function db_data() {
  var tempStore = []
  tempStore = await getData();
  var returnVal = testingonly(tempStore);

  return returnVal;
}

function testingonly(tempStore){
  return alpha.map(function(d){ 
    return {
      name: d,
      value: tempStore[alpha.indexOf(d)]//Math.floor(Math.random()*(7-3))+3
    }
  });
}

function customYAxis(g) {
  g.call(y_axis);
  //g.select(".domain").remove();
  //g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
  g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
}
