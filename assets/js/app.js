// Set up chart
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append SVG group to hold chart & shift left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g") 
  .attr("height", height)
  .attr("width", width)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
// Initial paramaters
var x_property = "poverty";
var y_property = "obesity";

  // Update x-scale & create scales
function xScale(data, x_property) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[x_property]) * 0.8,
    d3.max(data, d => d[x_property]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// Create function to update x-scale when clicking axis label & create scales
function yScale(data, y_property) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[y_property]) * 0.8,
    d3.max(data, d => d[y_property]) * 1.1
    ])
    .range([height, 0]);
  return yLinearScale;
}

// Create function to update xAxis when clicking axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
  // Create function to update xAxis when clicking Y axis label
function renderyAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale); 
  yAxis.transition()
    .duration(500)
    .call(leftAxis);
  return yAxis;
}
// Create function to update circles
function renderCircles(circlesGroup, newXScale, x_property, newYScale, y_property) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[x_property]))
    .attr("cy", d => newYScale(d[y_property]));
  return circlesGroup;
}

function renderText(circleText, newXScale, x_property, newYScale, y_property) {
  circleText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[x_property]))
    .attr("y", d => newYScale(d[y_property]));
  return circleText;
}

function updateToolTip(x_property,y_property, circlesGroup) {
  console.log("update tool tip", x_property);
  var label;
 
  // Set x & y axis label on tooltip 
  if (x_property === "poverty") {
    label = "Poverty:";
  }
  else if (x_property === "age") {
    label = "Age:";
  }
  else {
    label = "Household Income:";
  }
 
  if (y_property === "obesity") {
    ylabel = "Obesity:";
  }
  else if (y_property === "smokes") {
    ylabel = "Smokes:";
  }
  else {
    ylabel = "Healthcare:";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
          if (x_property === "poverty") {
            return (`${d.state}<br>${label} ${d[x_property]}%<br>${ylabel} ${d[y_property]}%`); 
          }
          else
          return (`${d.state}<br>${label} ${d[x_property]}<br>${ylabel} ${d[y_property]}%`);
    });
   
  //function chosen x and y tooltip
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data,this);
  })
    // on mouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data,this);
    });

  return circlesGroup;
}

  // Import Data
  d3.csv("assets/data/data.csv").then(function (data) {
  data.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.age = +d.age;
    d.income = +d.income;
    d.obese = + d.obese;
    d.smokes = +d.smokes
});

  // LinearScale functions 
  var xLinearScale = xScale(data, x_property);
  var yLinearScale = yScale(data, y_property);
 
  // Create bottom(x) and left(y) axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append axes
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis); 

  // Create circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[x_property])) 
    .attr("cy", d => yLinearScale(d[y_property])) 
    .attr("r", "15") 
    .attr("class", "stateCircle") 
    .attr("opacity", ".7");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "poverty")
    .classed("active", true)
    .text("Poverty %");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Age (Median)");  

  var obesityLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -60))
    .attr("value", "obesity") 
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -40))
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smokes (%)");

    var healthcareLabel = labelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", (margin.left) * 2.5)
    .attr("y", 0 - (height -20))
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text("Healthcare (%)");  

  //  Add text to circle
  var circleText = chartGroup.selectAll()
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[x_property])) 
    .attr("y", d => yLinearScale(d[y_property])) 
    .attr("class", "stateText") 
    .attr("font-size", "9");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(x_property, y_property,circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () { 
      // get value of selection
      var value = d3.select(this).attr("value");

     if(true){   
      if (value == "poverty" || value=="income" || value=="age") { 
        console.log(value)
        // replaces x_property with value
        x_property = value;
      
        xLinearScale = xScale(data, x_property);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // changes classes to change bold text
        if (x_property === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(x_property == "age"){
          ageLabel
          .classed("active", true)
          .classed("inactive", false);  
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true); 
       }
      } 
      else
        // replaces y_property with value
        y_property = value;
        yLinearScale = yScale(data, y_property);  
        // changes classes to change bold text
        if (y_property === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true); 
        }
        else if(y_property == "healthcare"){
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);  
          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true); 
       }
    
       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, x_property, yLinearScale, y_property);
      // update circle text
       circleText = renderText(circleText, xLinearScale, x_property, yLinearScale, y_property); 
       // updates tooltips with new info
       circlesGroup = updateToolTip(x_property, y_property, circlesGroup);

    } 
  }); 
}).catch(function (error) {
  console.log(error);
});