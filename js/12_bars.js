// Displays all 12 inputs in one place
// Reads from database 
// Still need to adjust graph to have percentages instead of numbers

var alpha = 
        ['a', 'b', 'c', 
        'd', 'e', 'f',
        'g', 'h', 'i',
        'j', 'k', 'l']

var myTicks = {a: alpha_two[0], b: alpha_two[1], c: alpha_two[2], 
              d: alpha_two[3], e: alpha_two[4], f: alpha_two[5],
              g: alpha_two[6], h: alpha_two[7], i: alpha_two[8],
              j: alpha_two[9], k: alpha_two[10], l: alpha_two[11]}

// setup
var setup = d3.marcon()
  .top(20)
  .bottom(20)
  .left(100)
  .right(120)
  .width(window.innerWidth)
  .height(window.innerHeight*.6);

setup.render();

var width = setup.innerWidth(), height = setup.innerHeight(), svg = setup.svg();

var x = d3.scaleBand()
  .rangeRound([0, width])
  .domain(alpha) // defines labels
  .padding(.2);

var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 10]);
  //.domain([0, 100], 10);

var x_axis = d3.axisBottom(x).tickFormat(d=>myTicks[d]); // allows same name inputs

var y_axis = d3.axisRight(y)
  .tickSize(width)

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis)

svg.append("g")
  .attr("class", "y axis")
  .call(customYAxis);

var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"]);

redraw(random_data());

d3.interval(function(){
  var tempStore = []
  db_data().then(x=>{ 
    tempStore = x; 
    for(var i = 0; i < 12; i++){
      document.getElementById('value'+i).innerHTML = tempStore[i].value; 
    }
    redraw(tempStore); 
  });
}, 2000);

function redraw(data){
  var x_var = Object.keys(data[0])[0], y_var = Object.keys(data[0])[1];

  y_axis.tickFormat(function(d, i, ticks){ return i == ticks.length - 1 ? d + " " + y_var + "s" : d; });
  d3.select(".y.axis").call(customYAxis);

  // join
  var bar = svg.selectAll(".bar")
  .data(data, function(d){ return d[x_var]; }); // draws bar

  var amount = svg.selectAll(".amount")
  .data(data, function(d){ return d[x_var]; }); // display count

  // update
  bar
  .transition()
  .attr("y", function(d){ return y(d[y_var]); })
  .attr("height", function(d){ return height - y(d[y_var]); });

  amount
  .transition()
  .attr("y", function(d){ return y(d[y_var]); })
  .text(function(d){ return d[y_var]; });

  // enter
  bar.enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d){ return x(d[x_var]); })
  .attr("y", function(d){ return y(d[y_var]); })
  .attr("width", x.bandwidth())
  .attr("height", function(d){ return height - y(d[y_var]); })
  .attr("fill", function(d){ return color(d[x_var]); });

  /*
  amount.enter().append("text")
  .attr("class", "amount")
  .attr("x", function(d){ return x(d[x_var]) + x.bandwidth() / 2; }) // where count is placed (xpos)
  .attr("y", function(d){ return y(d[y_var]); }) // where count is placed (ypos)
  .attr("dy", 16) // moves count slightly down
  .text(function(d){ return d[y_var]; }); */

}

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
  var tempStore = [];
  
  ajax_two.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //alert(this.responseText);
      var data_ = JSON.parse(this.responseText);
      for(var a = 0; a < data_.length; a++){
        tempStore[a]= (Number(data_[a].value));
      }
    };
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempStore);
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