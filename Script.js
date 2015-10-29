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
			//var tableFormatting = [""];
			
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
			html += '<tr>';
			for (var col = 0; col < tableHeaders.length; col++)
			{
				html += '<th>' + tableHeaders[col] + '</th>';
			}
			html += '</tr>';
			
			//loop through rows
			for (var row = 0; row < _this.Data.TotalSize.y; row++)
			{
				html += '<tr>';
				//Loop through columns
				for (var col = 0; col < _this.Data.TotalSize.x; col++) 
				{
					switch(col)
					{
						//Metric Name
						case 0:
						{
							html += '<td';
							html += ' class = "tableColumns"';
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
							html += ' class = "tableColumns"';
							html += ' id="overallscore_'+row+'"';
							html += '>';
							//html += _this.Data.Rows[row][col].text;
							
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
							html += '>';
							html += _this.Data.Rows[row][col].text;
							
							html += '</td>';
							break;
						}
						//Dynamic Dot Config
						case 6:
						{
							html += '<td';
							html += ' id = "aster_'+row+'"';
							html += '>';
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
				
				drawAsterPlot("aster_"+row,asterData);	
				
				//draw overall score dots
				var scoreData = _this.Data.Rows[row][3].text.split("/");
				drawOverallScore("overallscore_"+row,scoreData[0],scoreData[1]);
			}
			
			function drawOverallScore(divID,value,total)
			{
				var width = 50;//_this.GetWidth();// - margin.left - margin.right;//960 - margin.left - margin.right,
				var height = 50;//_this.GetHeight();// - margin.top - margin.bottom;//500 - margin.top - margin.bottom;
				
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
			
			function drawAsterPlot(divID,data)
			{
				//var labels = ["Dimension","Metric Name","AngleWeight","Radius","FillColor","ReferenceLine1","ReferenceLine2","Dynamic Dot Config"];
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
				var width = 50;//_this.GetWidth();// - margin.left - margin.right;//960 - margin.left - margin.right,
				var height = 50;//_this.GetHeight();// - margin.top - margin.bottom;//500 - margin.top - margin.bottom;
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