// Set up chart
var svgWidth = 800;
var svgHeight = 560;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper & append SVG group to hold chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial paramaters
var xproperty = "poverty";
var yproperty = "healthcare";

// Update xscale
function xscale(data, xproperty) {
    // Create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[xproperty]) * 0.8,
        d3.max(data, d => d[xproperty]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

// Udate xscale upon clicking axis label
function yscale(data, yproperty) {
    // Create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[yproperty]) * 0.8,
        d3.max(data, d => d[yproperty]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
}

// Update xaxis upon clicking axis label
function renderxaxis(newXscale, xaxis) {
    var bottomAxis = d3.axisBottom(newXscale);
    xaxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xaxis;
}

// Update xaxis upon clicking y axis label

function renderyaxis(newYscale, yaxis) {
    var leftAxis = d3.axisLeft(newYscale);
    yaxis.transition()
        .duration(500)
        .call(leftAxis);
    return yaxis;
}

// Import data from data.csv & format
d3.csv("/assets/data/data.csv").then(function(data) {
    data.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.age = +d.age;
        d.income = +d.income;
        d.obese = + d.obese;
        d.smokes = +d.smokes
});


// Create scaling functions   
    var xLinearScale = d3.scaleLinear()
        .domain([9, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

// Add axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "white");    

        chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });

// Initalize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("pointer-events", "none")
        .html(function(d) {
            return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });      

// tooltip in chart
    chartGroup.call(toolTip);   
    
// Add onmouseover event to display tooltip   
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // Add mouseout    
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Create axes labels  
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
});