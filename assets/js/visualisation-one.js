
var width = 0;
var height = 0;
var horizontalPadding = 0;
var verticalPadding = 0;


$(document).ready(function() {

  width  = $("#visualisation-one-svg").width(); //console.log(width);
  height = width/8*6;
  horizontalPadding = 50;
  verticalPadding = 50;

  drawSVG();

});

$(window).resize(function() {
  width  = $("#visualisation-one-svg").width(); //console.log(width);
  height = width/8*6;
  horizontalPadding = 50;
  verticalPadding = 50;

  $("svg").remove();
  $("#visualisation-one-filter").children().remove();
  drawSVG();
});

function drawSVG() {

var dispatch = d3.dispatch("load", "statechange");

var svg = d3.select("#visualisation-one-svg")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var x = d3.scale.linear()
          .range([horizontalPadding, width - horizontalPadding]);

var y = d3.scale.linear()
          .range([height - verticalPadding, verticalPadding]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

d3.csv("project.csv", function(error, data) {

  if(error) throw error;
  
  var stateById= d3.map();
  data.forEach(function(data) {
    data["Start Year"] = +data["Start Year"];
    data["Lifecycle Cost"] = +data["Lifecycle Cost"];
    stateById.set(data["Agency Name"], data);
  });

  dispatch.load(stateById);
  dispatch.statechange(stateById.get("Department of Agriculture"));
/*
  console.log(d3.min(data, function(d) { return d["Lifecycle Cost"]}) + " " + d3.max(data, function(d) { return d["Lifecycle Cost"]}));
  
  x.domain([d3.min(data, function(d) { return d["Start Year"]}), d3.max(data, function(d) { return d["Start Year"]})]);

  y.domain([d3.min(data, function(d) { return d["Lifecycle Cost"]}), d3.max(data, function(d) { return d["Lifecycle Cost"]})]);

  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function(d) { return x(d["Start Year"]); })
     .attr("cy", function(d) { return y(d["Lifecycle Cost"]); })
     .attr("r", 2);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0, " + (height - verticalPadding) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + horizontalPadding + ", 0)")
     .call(yAxis);
*/
});

// A drop-down menu for selecting a state; uses the "menu" namespace.
dispatch.on("load.menu", function(stateById) {
  var select = d3.select("#visualisation-one-filter")
                 .append("div")
                 .on("change", function() { dispatch.statechange(stateById.get(this.value)); });

  select.selectAll("input")
        .data(stateById.values())
        .enter()
        .append("label")
        .text(function(d) { return d["Agency Name"]; })
        .append("input")
        .attr("type", "checkbox")
        .attr("value", function(d) { return d["Agency Name"]; });

  dispatch.on("statechange.menu", function(state) {
    select.property("value", state.id);
  });
});

// A scatterplot chart to show total population; uses the "scatterplot" namespace.
dispatch.on("load.scatterplot", function(stateById) {

  console.log(stateById.values());

  console.log(d3.min(stateById.values(), function(d) { return d["Lifecycle Cost"]}) + " " + d3.max(stateById.values(), function(d) { return d["Lifecycle Cost"]}));
  
  x.domain([d3.min(stateById.values(), function(d) { return d["Start Year"]}), d3.max(stateById.values(), function(d) { return d["Start Year"]})]);

  y.domain([d3.min(stateById.values(), function(d) { return d["Lifecycle Cost"]}), d3.max(stateById.values(), function(d) { return d["Lifecycle Cost"]})]);

  svg.selectAll("circle")
     .data(stateById.values())
     .enter()
     .append("circle")
     .attr("cx", function(d) { return x(d["Start Year"]); })
     .attr("cy", function(d) { return y(d["Lifecycle Cost"]); })
     .attr("r", 2);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0, " + (height - verticalPadding) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + horizontalPadding + ", 0)")
     .call(yAxis);

  dispatch.on("statechange.scatterplot", function(d) {
    
  });
});

//end of function drawSVG
};




