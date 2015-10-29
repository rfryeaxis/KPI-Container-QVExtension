Qva.LoadScript("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/KPI Container/d3.js", function()
{
	Qva.LoadScript("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/KPI Container/d3-tip.js", function()
	{
		Qva.AddExtension('KPI Container', function()
		{
			Qva.LoadCSS("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/KPI Container/style.css");
			
			_this = this;
			this.Element.innerHTML="";
			var html = "";
			
			var tableHeaders = ["Metric Name","Responsible Party","Overall Score","Trend Last 12 Months","Dynamic Dot","Synthesis"];
			var tableFormatting = ["metricname","responsibleparty","overallscore","trend","dynamicdot","synthesis"];
			
			_this.Data.SetPagesizeY(_this.Data.TotalSize.y);
			_this.Data.SetPagesizeX(_this.Data.TotalSize.x);			
/*
			html = '<table style = "width:100%">';
			html += '<td>Name</td>';
			html += '<td><div id = "aster"></div></td>';
			html += '</tr>';
			html += '</table>';
*/

			//Populate HTML table
			html = '<table style = "width:100%" border = "1">';
			
			//add headers
			html += '<tr class = "header">';
			for (var col = 0; col < tableHeaders.length; col++)
			{
				html += '<th'
				//html += '<div ';
				html += ' class = "' + tableFormatting[col] + '"';
				html += '>' + tableHeaders[col] + '</th>';
			}
			html += '</tr>';
			
			//loop through rows
			for (var row = 0; row < _this.Data.TotalSize.y; row++)
			{
				html += '<tr class = "row">';
				//Loop through columns
				for (var col = 0; col < _this.Data.TotalSize.x; col++) 
				{
					switch(col)
					{
						//Metric Name
						case 0:
						{
							html += '<td';
							html += ' class = "table_metricname"';
							html += '>';
							html += _this.Data.Rows[row][col].text;
							html += '</td>';
							break;
						}
						//Responsible Party
						case 1:
						{
							html += '<td';
							html += '>';
							html += _this.Data.Rows[row][col].text;
							
							html += '</td>';
							break;
						}
						//Responsible Party Image
						case 2:
						{
							//html += '<td';
							//html += '>';
							//html += _this.Data.Rows[row][col].text;
							
							//html += '</td>';
							break;
						}
						//Overall Score
						case 3:
						{
							html += '<td';
							html += ' id="overallscore_'+row+'"';
							html += '>';
							html += _this.Data.Rows[row][col].text.split("/")[0];
							
							html += '</td>';
							break;
						}
						//Trend Change
						case 4:
						{
							//html += '<td';
							//html += '>';
							//html += _this.Data.Rows[row][col].text;
							
							//html += '</td>';
							break;
						}
						//Trend
						case 5:
						{
							html += '<td';
							html += ' id = "trend_' + row + '"';
							html += '>';
							//html += _this.Data.Rows[row][col].text;
							
							html += '</td>';
							break;
						}
						//Dynamic Dot Config
						case 6:
						{/*
							html += '<td';
							html += ' id = "aster_'+row+'"';
							html += ' class = "table_dynamicdot"';
							html += '>';
							html += '</td>';
							break;
						}*/
							html += '<td>';
							html += '<div id = "aster_'+row+'"';
							html += ' class = "table_dynamicdot">';
							html += '</div>';
							html += '</td>';
							break;
						}
						//Synthesis
						case 7:
						{
							html += '<td';
							html += '>';
							html += _this.Data.Rows[row][col].text;
							
							html += '</td>';
							break;
						}
						default:
						{
							break;
						}
					}
				}
				html += '</tr>';
			}
			html += '</table>';

			_this.Element.innerHTML = html;

			//alert(html);

			for (var row = 0; row < _this.Data.TotalSize.y; row++)
			{
				//draw aster plots
				var asterData = _this.Data.Rows[row][6].text.split(",");

				for(var asterRow = 0; asterRow < asterData.length; asterRow++)
				{
					asterData[asterRow] = asterData[asterRow].split("/");
				}
				
				drawAsterPlot(_this,"aster_"+row,asterData);	
				
				//draw overall score dots
				var scoreData = _this.Data.Rows[row][3].text.split("/");
				drawOverallScore(_this,"overallscore_"+row,scoreData[0],scoreData[1]);
				
				//draw line chart
				var lineData = _this.Data.Rows[row][5].text.split(",");
				drawLineChart(_this,"trend_"+row,lineData);
			}
						
			function drawLineChart(_this,divID,data)
			{
				//https://gist.github.com/benjchristensen/2579599				
				// define dimensions of graph
				var m = [80, 80, 80, 80]; // margins
				
				var w = _this.GetWidth()*.15;//100;//1000 - m[1] - m[3]; // width
				var h = _this.GetHeight() * .1;//400 - m[0] - m[2]; // height
				
				// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
				//var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
				// X scale will fit all values from data[] within pixels 0-w
				var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
				// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
				var y = d3.scale.linear().nice().domain([0, Math.max.apply(Math, data)]).range([h, 0]);
				// automatically determining max range can work something like this
				// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
				// create a line function that can convert data[] into x and y points
				var line = d3.svg.line()
				// assign the X function to plot our line as we wish
				.x(function(d,i) { 
					// verbose logging to show what's actually being done
					//('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
					// return the X coordinate where we want to plot this datapoint
					return x(i); 
				})
				.y(function(d) { 
					// verbose logging to show what's actually being done
					//alert('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
					// return the Y coordinate where we want to plot this datapoint
					return y(d); 
				})
				// Add an SVG element with the desired dimensions and margin.
				var graph = d3.select(document.getElementById(divID)).append("svg:svg")
						.attr("width", w)
						.attr("height", h)
					.append("svg:g")
						//.attr("transform", "translate(" + w/2 + "," + h/2 + ")")
				;
				// create yAxis
				//var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
				// Add the x-axis.
				/*graph.append("svg:g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + h + ")")
					  .call(xAxis);*/
				// create left yAxis
				//var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
				// Add the y-axis to the left
				/*graph.append("svg:g")
					  .attr("class", "y axis")
					  .attr("transform", "translate(-25,0)")
					  .call(yAxisLeft)
				;*/
				
				// Add the line by appending an svg:path element with the data line we created above
				// do this AFTER the axes above so that the line is above the tick-lines
				graph.append("svg:path").attr("d", line(data))
					.attr("fill","none")
					.attr("stroke","black")
				;
			}
			
			function drawOverallScore(_this,divID,value,total)
			{
				//alert(document.getElementById(divID).style.width);
				var width = _this.GetWidth * .15;//_this.GetWidth();// - margin.left - margin.right;//960 - margin.left - margin.right,
				var height = 10;//_this.GetHeight();// - margin.top - margin.bottom;//500 - margin.top - margin.bottom;
				
				var svg = d3.select(document.getElementById(divID)).append("svg")
					.attr("width",width)
					.attr("height",height);
					
				var lastFilledDot;
				
				var color;
				
				if(value <= 3)
				{
					color = "#CC3300";
				}
				else
				{
					if(value <=7)
					{
						color = "#FFFF00";
					}
					else
					{
						color = "#99FF66";
					}
				}
				
				for(var i = 0; i < value; i ++)
				{
					var cx = 5 + i*11;
					var circle = svg.append("circle")
						.attr("cx",cx)
						.attr("cy",height/2)
						.attr("r",5)
						.attr("fill",color)
						.attr("stroke","black")
						
					lastFilledDot = i;
				}
				
				for(var i = lastFilledDot+1; i < total; i ++)
				{
					var cx = 5 + i*11;
					var circle = svg.append("circle")
						.attr("cx",cx)
						.attr("cy",height/2)
						.attr("r",5)
						.attr("fill","none")
						.attr("stroke","black")
						;
				}
			}
			
			function drawAsterPlot(_this,divID,data)
			{
				var labels = ["Dimension","AngleWeight","Radius","FillColor","ReferenceLine1","ReferenceLine2"];
				var sliceStart = 0;
				
				//alert(data[1][0]);
								
				/*BEGIN build_json_table*/
				var jsonCombined="";
				var row = 0;
				var col = 0;
				
				/*loop through rows axis*/
				//for (var row = 0; row < _this.Data.TotalSize.y; row++)
				for (var row = 0; row < data.length; row++)
				{
					jsonCombined += "{";
					//Loop through columns axis
					//for (var col = 0; col < _this.Data.TotalSize.x; col++)
					for (var col = 0; col < data[0].length; col++) 
					{
						jsonCombined += '"' + labels[col] + '":';
						//jsonCombined += '"' + _this.Data.Rows[row][col].text+'" ,';
						jsonCombined += '"' + data[row][col]+'" ,';
					}
					jsonCombined += "}";
				}
				
				//format table
				jsonCombined = 
					//'{"Results" : [\n'+
					"[" +
						jsonCombined.replace(/,}/g,"}").replace(/}{/g,"},{").replace(/""/g,'"')
					+ "]"
					//+ '\n]}'
					;

				//validation of table - can comment _this out
				//alert(jsonCombined);

				var jsonData = jQuery.parseJSON(jsonCombined);

				/*END build_json_table*/	
				/*BEGIN LOAD CHART*/
				var margin = {top: 10, right: 30, bottom: 10, left: 30};
				var width = _this.GetWidth() * .1;//_this.GetWidth();// - margin.left - margin.right;//960 - margin.left - margin.right,
				var height = _this.GetHeight() * .2;//_this.GetHeight();// - margin.top - margin.bottom;//500 - margin.top - margin.bottom;
				var radius = Math.min(width,height)/2
				var innerRadius = 0;
			
				var pie = d3.layout.pie()
					.sort(null)
					.value(function(d){return d.width;});

				var tip = d3.tip()
					.attr('class','d3-tip')
					.offset([0,0])
					.html(function(d){
						return d.data.Dimension + ": <span style = 'color:orangered'>" + d.data.Radius + "</span>";
						//return d.data.label + ": <span style = 'color:orangered'>" + d.data.score + "</span>";
					});
				
				//Draws individual filled arcs for pie slices
				var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(function(d){
						return d.data.Radius/10 * radius;
					})
					.startAngle(function(d){
						return sliceStart * (Math.PI/180);
					})
					.endAngle(function(d){
						sliceStart += (d.data.AngleWeight * 360);
						return (sliceStart) * (Math.PI/180);
					});
				
				//Draws outline of entire pie
				var outlineArc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(radius)
					.startAngle(0)
					.endAngle(360 * (Math.PI/180));
					
				var referenceArc1 = d3.svg.arc()
					.innerRadius(function(d){
						return d.data.ReferenceLine1/10 * radius;
					})
					.outerRadius(function(d){
						return d.data.ReferenceLine1/10 * radius;
					})
					.startAngle(0)
					.endAngle(360 * (Math.PI/180))
				;

				var referenceArc2 = d3.svg.arc()
					.innerRadius(function(d){
						return d.data.ReferenceLine2/10 * radius;
					})
					.outerRadius(function(d){
						return d.data.ReferenceLine2/10 * radius;
					})
					.startAngle(0)
					.endAngle(360 * (Math.PI/180))
				;
				
				var svg = d3.select(document.getElementById(divID)).append("svg")
					.attr("width",width)
					.attr("height",height)
					.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
					.attr("class","svg")
				;

				svg.call(tip);

				jsonData.forEach(function(d) {
					
					d.Dimension = d.Dimension;
					d.AngleWeight = +d.AngleWeight;
					d.Radius = +d.Radius;
					d.FillColor = d.FillColor;
					d.ReferenceLine1 = +d.ReferenceLine1;
					d.ReferenceLine2 = +d.ReferenceLine2;
				});
				
				var outerPath = svg.select(".referenceArc1")
						.data(pie(jsonData))
					.enter().append("path")
						.attr("fill","none")
						.attr("stroke","red")
						.style("stroke-dasharray",("5,5"))
						.style("stroke-width",".2")
						.attr("class","referenceArc1")
						//.attr("id","#referenceArc1_1")
						.attr("d",referenceArc1)
				;

				var outerPath = svg.selectAll(".referenceArc2")
						.data(pie(jsonData))
					.enter().append("path")
						.attr("fill","none")
						.attr("stroke","green")
						.style("stroke-dasharray",("5,5"))
						.style("stroke-width",".2")
						.attr("class","referenceArc2")
						.attr("d",referenceArc2)
				;
				
				var path = svg.selectAll(".solidArc")
						.data(pie(jsonData))
					.enter().append("path")
						.attr("fill",function(d) {
							return d.data.FillColor;
						})
						.attr("class", "solidArc")
						.attr("stroke", "gray")
						.style("stroke-width",".5")
						.attr("d", arc)
						.on('mouseover', tip.show)
						.on('mouseout', tip.hide)
				;
				
				/*END LOAD CHART*/
			}
			
			
			
		}, true);
	});
});
//});