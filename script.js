//Receive data to be used.
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
  
     const width = 1500
     const height = 400

     let colors = ["#5e4fa4", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"]
     
     let svg =  d3.select("#chart")
                   .append("svg")
                   .attr("width", width - 200)
                   .attr("height", height + 130)
                   .call(responsivefy)
     
     let legend = svg.append("g")
                     .attr("id", "legend")
     
     let tooltip = d3.select("#chart")
                      .append("div")
                      .attr("id", "tooltip")
      
      //Acquire x-axis values
      let years = data.monthlyVariance.map(function(item) {
        return item.year
      })
  
      let sortedYears = years.sort(function(a, b) {
        return a - b
      })
      let minYear = sortedYears[0]
      let maxYear = sortedYears[sortedYears.length - 1]

      //Sets x-axis
      let xScale = d3.scaleTime()
                     .domain([minYear, maxYear])
                     .range([0, width - 600])
                 
      let xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickFormat(d3.format("d"))
                    .tickSizeOuter(0)
                    .tickSizeInner(3)
      
      svg.append("g")
         .call(xAxis)
         .attr("id", "x-axis")
         .attr("transform", "translate(200, 440)")
         .attr("class", "axisWhite")
  
      svg.append("text")
         .attr("transform", "translate(700, 490)")
         .text("Year")
         .attr("id", "bottomText")
  
      //sets y-axis
      let yScale = d3.scaleBand()
                     .domain(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
                     .range([0, height])
        
      let yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickSizeOuter(0)
                    .tickSizeInner(3)
             
      svg.append("g")
         .call(yAxis)
         .attr("id", "y-axis")
         .attr("transform", "translate(200, 40)")
         .attr("class", "axisWhite")
  
      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("x", -300)
         .attr("y", 120)
         .text("Month")
         .attr("id", "sideText")
  
      d3.selectAll("text").style("fill","white")  
  
      //Map
      svg.selectAll("rect")
         .data(data.monthlyVariance)
         .enter()
         .append("rect")
         .attr("class", "cell")
         .attr("data-month",function(d){
            return d.month - 1
         })
         .attr("data-year",function(d){
            return d.year
         })
         .attr("data-temp",function(d){
            return data.baseTemperature + d.variance
         })
         .attr("x", function (d) {
            return xScale(d.year)
        })
         .attr("y", function(d,i) { return (d.month) *(height / 12) })
         .attr("transform", "translate(200, 7)")
         .attr("height", (height / 12))
         .attr("width", width / 262)
         .attr("fill", function(d){
				  	   	  var t = data.baseTemperature + d.variance
					    	  if(t < 2.7){
					    	  	  return colors[0];
					    	  } else if(t < 3.9 && t >= 2.7){
					   	  	    return colors[1];
					   	    } else if(t < 5 && t >= 3.9){
					   	  	    return colors[2];
					   	    } else if(t < 6.1 && t >= 5){
					   	  	    return colors[3];
					   	    } else if(t < 7.2 && t >= 6.1){
					   	  	    return colors[4];
					   	    } else if(t < 8.3 && t >= 7.2){
					   	  	    return colors[5];
					   	    } else if(t < 9.4 && t >= 8.3){
					   	  	    return colors[6];
					   	    } else if(t < 10.5 && t >= 9.4){
					   	  	    return colors[7];
					   	    } else if(t < 11.6 && t >= 10.5){
					   	  	    return colors[8];
					   	    } else if(t < 12.7 && t >= 11.6){
					   	  	    return colors[9];
					   	    } else if(t >= 12.7){
					   	  	    return colors[10];
					   	    } else{
					   	  	    return colors[0];
					   	    }
					   })
          .on("mouseover", function(d) {
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
            tooltip.style("opacity", .9)
            tooltip.attr("data-year", d.year)
            tooltip.html(months[d.month-1]   + " " + d.year + "<br/>Temp: " + (data.baseTemperature + d.variance).toFixed(2) + " °C")
                   .style("left", (d3.event.pageX + 15) + "px")
                   .style("top", (d3.event.pageY) + "px")
            })
         .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
          })
  
         //Legend    
        for(var i=0;i<colors.length;i++){
           legend.append("g")
                 .append("rect")
                 .attr("x", width - (20 * (i+1)))
                 .attr("y", height + 60)
                 .attr("width", 20)
                 .attr("height", 20)
                 .attr("fill", colors[colors.length - 1 - i])
                 .attr("transform", "translate(-1000, 20)")
         }
  
           svg.append("g")
              .attr("class", "legendLabel")
              .append("text")
              .attr("x", width - (28 * (i+1)) + 20)
              .attr("y", height + 90)
              .attr("transform", "translate(-892, 30)")
              .text("2.8°C" + "\xa0\xa0\xa0" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "7.2°C" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0\xa0\xa0\xa0\xa0" + "12.8°C")
            d3.selectAll("text").style("fill","white") 
      
    
  /* The below function makes the graph responsive.  It was taken from Ben Clinkinbeard's website and was  originally written by Brendan Sudol. https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/?utm_content=buffer976d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer */
  
    function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width"), 10),
        height = parseInt(svg.style("height"), 10),
        aspect = width / height

    svg.attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on(
        "resize." + container.attr("id"), 
        resize
    );
    
    function resize() {
        const w = parseInt(container.style("width"));
        svg.attr("width", w);
        svg.attr("height", Math.round(w / aspect));
    }
  }
})