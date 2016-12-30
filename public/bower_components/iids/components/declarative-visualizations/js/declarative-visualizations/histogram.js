define([
  'jquery',
  'brandkit',
  'd3-amd',
  'declarative-visualizations/tooltip'
  ], function ($, brandkit, d3, d3tip) {
    'use strict';
    return function (element, opt) {
       
       var el = $(element);
       el.addClass('histogram');

       // DEFAUTLS
       var DEFAULTS = {
         bins: 5,    
         frequency: false,
         tooltip: true,
         brushing: true,
         colorTheme: "blue",
         tweenDuration: 500,
         margin: {top: 22, right: 30, bottom: 22, left: 30},
         x: null,
         y: null,
         xAxisOrient: "bottom", // bottom | top
         yAxisOrient: "left", // left | right
         showXAxis: true, 
         showYAxis: true,
         showBarsValue: true,
         barsColor: "steelblue"
       };

       // merge options
       var tempOpt = {};
       for (var i in DEFAULTS){
          if (el.data((""+i).toLowerCase()))
             tempOpt[i] = el.data((""+i).toLowerCase());
          if (el.data(""+i))
             tempOpt[i] = el.data(""+i); 
       }     
       
       var settings = $.extend(
           false,
           {},
           DEFAULTS,
           typeof tempOpt === 'object' && tempOpt
       );
       
       settings = $.extend(
           false,
           {},
           settings,
           typeof opt === 'object' && opt
       );

       // build pallete from brandkit
       var colorThemes = ["orange", "purple", "red", "blue", "green", "yellow"];

       // Data
       var data = null;
       var binData = null;

       // Dimensions
       var outerWidth, outerHeight;  // the box dimensions including margins
       var width, height, left, right, top, bottom;  // dimensions excluding margins
       // margins for axes
       var paddingX, paddingY;
       // Axes
       var xAxis = null;
       var yAxis = null;
       
       var x, y, xAxisTickValues = [];
       
       // Bars
       var paddingBar = 0;
       

       // A formatter for counts.
       var formatCount = d3.format(",.0f");
       if (settings.frequency == false)
          formatCount = d3.format(",.02f");
       
       // TODO calculate default color scales if not specified
       var colorScale;


       // Canvas
       var histogram = d3.select(element);
       var svg, g;

       // tooltip
       var tip = null;

       // brushing control
       var brush = null;

       // event dispatcher
       var dispatch = d3.dispatch('hover', 'click', 'brush', 'brushend');

       function updateViz(seriesData) {

          if (seriesData === undefined || seriesData === null || seriesData.length == 0) {
            return;
          }
          
          // update the canvas size, settings etc.
          configViz();
          
          // process data
          processData(seriesData);
          
         // draw the viz
         drawViz();
       }
       
       
       /*******************
       Configuration
      *******************/
        function configViz() {
          // margins for axes
          paddingX = 0;
          paddingY = 0; 
          if (settings.xAxisOrient == 'top')
             paddingX = 1;
          
          outerWidth = document.getElementById(el.attr("id")).offsetWidth || 600;
          outerHeight = document.getElementById(el.attr("id")).offsetHeight || 600;
          left = parseInt(settings.margin.left) + paddingX;
          right = parseInt(settings.margin.right);
          top = parseInt(settings.margin.top) + paddingY;
          bottom = parseInt(settings.margin.bottom);
          width = outerWidth - left - right;
          height = outerHeight - top - bottom;
          
          if (!svg){
             svg = histogram.append("svg");
             g = svg.append("g");
          }
          
          svg.attr("width", outerWidth).attr("height", outerHeight);
          g.attr("transform", "translate(" + left + "," + top + ")");
   
   
          // update the color scale for each cell
          var color = brandkit.accentPalette[settings.colorTheme.toLowerCase()];
          if (color === undefined || color === null) {
            console.error('The color theme is not supported!');
            return;
          }
          
        };
        
        /*******************
        Data processing
       *******************/
         function processData(seriesData) {
           data = seriesData;
           
           if (settings.x)
              x = settings.x;
           else
              x = d3.scale.linear()
                 .domain([d3.min(data), d3.max(data)])
//              .domain([0, d3.max(data)])
                 .range([0, width]);
           
           var threshold = x.ticks(settings.bins);
           threshold.push(d3.max(data));
           threshold.splice(0,0, d3.min(data));
           
           binData = d3.layout.histogram()
//                    .bins(threshold)
                    .bins(settings.bins)
                    .frequency(settings.frequency)
                    (data);
           
//           console.log(d3.layout.histogram().bins(settings.bins)(data));
           
           xAxisTickValues = [];
           
           for (var i in binData){
              xAxisTickValues.push(binData[i].x);
           }
           xAxisTickValues.push(binData[i].x + binData[i].dx);
           
           if (settings.y)
              y = settings.y;
           else
              y = d3.scale.linear()
                 .domain([0, d3.max(binData, function(d) { return d.y; })])
                 .range([height, 0]);
         }
        
        
     
     /*******************
     Drawing functions
    *******************/
      function drawViz() {
        // draw axes
        drawAxes();
   
        // draw bars
        drawBars();
   
        // enable/disable tooltip
        drawTip();
   
        // enable/disable brushing
        drawBrush();
   
      }
      
      function drawAxes() {
         
         // remove any existing axis 
         
         svg.selectAll('.axis').remove();
         
         if(settings.showXAxis){
            // draw xAxis
            xAxis = d3.svg.axis()
                     .scale(x)
//                     .ticks(settings.bins)
                     .tickValues(xAxisTickValues)
                     .orient(settings.xAxisOrient);
            
            var xAxisLoc = height + top + paddingX;
            if (settings.xAxisOrient == "top")
               xAxisLoc = top - paddingX;
            
            // draw 
            svg.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate("+ left + "," + xAxisLoc + ")")
               .call(xAxis);
         }
         
         if(settings.showYAxis){
            // draw yAxis
            yAxis = d3.svg.axis()
                     .scale(y)
                     .orient(settings.yAxisOrient)
                     .ticks(5);
            
            var yAxisLoc = left - paddingY;
            if (settings.yAxisOrient == "right")
               yAxisLoc = left + width + paddingY;
            
            // draw 
            svg.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate("+ yAxisLoc + "," + top + ")")
               .call(yAxis);
         }

       }
      
      function drawBars(){
         
         g.selectAll(".bar")
            .data(binData)
            .exit().remove();
      
         var bar = g.selectAll(".bar")
                     .data(binData)
                     .transition() // start a transition to bring the new value into view
                     .ease("linear")
                     .duration(settings.tweenDuration)
                     .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
                     .style("fill", brandkit.accentPalette[settings.colorTheme.toLowerCase()]);
         if (bar){
            bar.select("rect")
               .attr("width", function(d){return x(d.dx + binData[0].x) - paddingBar; })
               .attr("height", function(d) { return height - y(d.y); });
            
               bar.select("text")
                  .attr("x", function(d){return x(d.dx + binData[0].x) / 2; })
                  .text(function(d) { return formatCount(d.y); })
                  .style("visibility", (settings.showBarsValue == true) ? "visible" : "hidden");
         }
         
         bar = g.selectAll(".bar")
            .data(binData)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
            .style("fill", brandkit.accentPalette[settings.colorTheme.toLowerCase()])
            .on("click", onBarMouseClick)
            .on("mouseover", onBarMouseOver)
            .on("mouseout", onBarMouseOut);
         
        bar.append("rect")
            .attr("x", paddingBar)
            .attr("width", function(d){return x(d.dx + binData[0].x) - paddingBar; })
            .attr("height", function(d) { return height - y(d.y); });
        
        
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", function(d){return x(d.dx + binData[0].x) / 2; })
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); })
            .style("visibility", (settings.showBarsValue == true) ? "visible" : "hidden");
         
      }
      
      function drawTip(){
         if (settings.tooltip === true) {
            // remove old one if exists
            g.selectAll(".d3-tip").remove();
            // enable the tooltip
            tip = d3tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  var html = "<strong>Count:</strong> <span>" + d.length + "</span>";
//                  html += "<br/><strong>" + settings.valueField + ":</strong> <span>" + d[settings.valueField] + "</span>"
                  return html;
                });
              g.call(tip);
          }
          else {
            g.selectAll(".d3-tip").remove();
            tip = null;
          }
     }

     function drawBrush() {
          // update the brushing if needed
          if (settings.brushing === true) {
            // remove old one if exists
            g.selectAll('.brush').remove();
            
            brush = d3.svg.brush()
                     .x(x)
                     .on("brushend", onBrushEnd)
                     .on("brush", onBrush);
                     
            g.append('g')
               .attr("class", "brush")
               .call(brush);
          }
          else {
            g.selectAll('.brush').remove();
            brush = null;
          }
     }
     
     function onBarMouseClick(d){
     // unselectall first
//        svg.selectAll(".bar rect")
//          .classed("selected", false);
        // select the one clicked
//        d3.select(this).select("rect").classed("selected", true);
        // event callback
        var bin = d3.select(this).data()[0];
        dispatch.click(bin, d3.select(this));
     }
     
     function onBarMouseOver(d) {
        // unselectall first
//        svg.selectAll(".bar rect")
//          .classed("highlighted", false);
        // select the one clicked
//        d3.select(this).select("rect").classed("highlighted", true);
        // tip
        if (tip !== null) {
          tip.show(d, d3.event.target);
        }
        // event callback
        var bin = d3.select(this).data()[0];
        dispatch.hover(bin, d3.select(this));
      }

    function onBarMouseOut(d) {
//        d3.select(this).select("rect").classed("highlighted", false);
        // tip
        if (tip !== null) {
          tip.hide(d);
        }
    }
    
    function onBrush(d){
       dispatch.brush(d);
       console.log(d)
    }
    
    function onBrushEnd(d){
       dispatch.brushend(d);
    }
       
     /*******************
     Public methods
    *******************/
     histogram.on = function(type, listener) {
        dispatch.on(type, listener);
        return histogram;
      }
   
     histogram.update = function(seriesData, opt){
        // merge options
        var tempOpt = {};
        for (var i in DEFAULTS){
           if (el.data((""+i).toLowerCase()))
              tempOpt[i] = el.data((""+i).toLowerCase());
           if (el.data(""+i))
              tempOpt[i] = el.data(""+i);
        }     
        
        settings = $.extend(
            false,
            {},
            settings,
            typeof tempOpt === 'object' && tempOpt
        );

        
        settings = $.extend(
          false,
          settings,
          typeof opt === 'object' && opt
        );
        
        formatCount = d3.format(",.0f");
        if (settings.frequency == false)
           formatCount = d3.format(",.02f");
        
        updateViz(seriesData);
        return histogram;
      }
   
      // render the empty calendar
     histogram.update([]);
     
     
       return histogram;
    };
  }
);