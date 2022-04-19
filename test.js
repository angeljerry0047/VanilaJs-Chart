$(document).ready(function () {
      $.ajax({
            type: "GET",
            url: "http://www.allianzimetf.com.php73-38.phx1-2.websitetestlink.com/chart/Allianz_Premium_Discount_Chart_data.csv",			
            dataType: "text",
            success: pdiscGraphLOADsuccess,
            error: pdiscGraphLOADfail
        });	
});

function pdiscGraphLOADfail(){
    //do nothing if file not found
}


// this will normally only be called after document.ready
function pdiscGraphLOADsuccess(text){
	text = text.split('\n')
	
   			
   	  let rows = []
   	 for(let index = 1;index<text.length;index++)
   	 {
   	 	rows.push({'Trading Date':text[index].split(',')[1],'P/D Display':Number(text[index].split(',')[4]),'Ticker':text[index].split(',')[2], 'Result' : text[index].split(',')[5] })
   	 }

   	 var pdiscGraphresults = {
   	 	results:{
   	 		rows
   	 	}
   	 }

   	 // console.log(pdiscGraphresults);return;
    var pdPoints = [];
    var mostRecentPoint = 0;

    for (i = 0; i < pdiscGraphresults.results.rows.length; i++) {
       
		if (pdiscGraphresults.results.rows[i]["Ticker"] == "AZAA") {
			pdPoints.push({'x' : Date.parse(pdiscGraphresults.results.rows[i]['Trading Date']), 'y': pdiscGraphresults.results.rows[i]['P/D Display'], 'result' : pdiscGraphresults.results.rows[i]['Result']});
        }	
	
	
	
        if (i == (pdiscGraphresults.results.rows.length - 1)) {
            //we know we're on the last loop
            $("#pdiscDate").html(pdiscGraphresults.results.rows[i]['Trading Date']);
            mostRecentPoint = Date.parse(pdiscGraphresults.results.rows[i]['Trading Date']);
        }
    }

    // console.log(pdPoints);return;
	    

	const jsonpdPoints = pdPoints;

	Highcharts.setOptions({
    global: {
        useUTC: false
    },
		lang: {
	        // Pre-v9 legacy settings
	        rangeSelectorFrom: 'Period shown:',
	        rangeSelectorTo: 'to',
			rangeSelectorZoom: ''
	    }
	});

    Highcharts.stockChart('blok_pdiscGraph', {
    	title: {
            text: null
        },

        chart: {
			renderTo: 'blok_pdiscGraph',
            plotBackgroundColor: null,
            backgroundColor: null,
			marginRight: 32,
			//marginBottom: 25,
        },

        subtitle: {
            text: null
        },

        credits: {
            enabled: false
        },
        colors: ['#003781', '#3c3c3c'], 

        yAxis: {
            //min: -2.50,
			//max: 2.50,
			softMin: -2.50,
			softMax: 2.50,
			//tickInterval: .5,
			tickPositions: [-2.50, -1.50, -0.50, 0.50, 1.50, 2.50],
			showLastLabel: true,
			//minRange: 2,							
			//minPadding: 0.5,
			//maxPadding: 2.5,			
			//startOnTick: false,
			//endOnTick: false,
			  offset: 10,
			plotLines: [{
				color: '#819ccc',
				width: 2,
				value: 0
				}],
			
			title: {
                text: null
            },
            labels: {
			      y: 3,
                style: { 
                    fontFamily: '"Allianz Neo", sans-serif',
                    fontSize: '15px', 
                    color: '#3c3c3c', 
                    fontWeight: 'normal',

                },
                format: '{value:.2f}%',
            },
            opposite: false,
        },
        xAxis: {
            type: 'datetime', 
			tickPositioner: function(min, max) {
	           var ticks = this.tickPositions,
	                interval = this.interval,
	                newTicks = [],
	              start = new Date(ticks[0]);
	          // render tick in a first day of each month
	          start.setDate(1);
	           // add labels, one for every month:
	           while (min <= max) {
	            start.setMonth(start.getMonth() + 1);
	             min = start.getTime();
	             newTicks.push(min);
	          }
	          // store original info of labels:
	           newTicks.info = ticks.info;
	           return newTicks;
	        },	
			
            startOnTick: false,
            endOnTick: false, 
			//showFirstLabel: true,				
            tickWidth: 1,
			offset: 0,
			tickLength: 15,
			lineWidth: 1,
            
            dateTimeLabelFormats: {
                day: '%m/%d',
                week: '%m/%d',
                month: '%m/%Y',
            },
            
            labels: {
				format: '{value:%b %Y}',
				y: 30,
                style: { 
                    fontFamily: '"Allianz Neo", sans-serif',
                    fontSize: '15px', 
                    color: '#3c3c3c', 
                    fontWeight: 'normal', 
					autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                },
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            symbolWidth: 35,
            itemStyle: { 
                    fontFamily: '"Allianz Neo", sans-serif',
                    fontSize: '15px', 
                    color: '#3c3c3c', 
                    fontWeight: 'bold', 
                },
        },

        plotOptions: {
            series: {
				showInNavigator: true,
                label: {
                    connectorAllowed: false
                },
                marker: {
                    enabled: false
                },
            }
        },
		
		scrollbar: { enabled: false },
		
        exporting: {
            enabled: false
        },
        tooltip: {
			headerFormat: '<span style="">{point.x:%B %e, %Y}</span><br>',			
			split: false,
			enabled: true,
			padding: 10,
			useHTML: false,			
			crosshairs: {
                color: '#C2C2C2',
                dashStyle: 'solid'
            },
			crosshairs: true,
			pointFormat: '{series.name}: <b>{point.y:.2f}</b><br/>',
		     	  
            valueSuffix: '%',
            valuePrefix: '',
            xDateFormat: '%B %e, %Y',
            shared: true,
            style: {
                fontFamily: '"Allianz Neo", sans-serif',
            },
            //split: true,
            formatter: function(tooltip) {
            	var default_tooltip = tooltip.defaultFormatter.call(this, tooltip);
            	const pointData = jsonpdPoints.find(row => row.x === this.x)
            	default_tooltip[1] = default_tooltip[1].replace("Premium/Discount", pointData.result);
            	return default_tooltip;
            	
		    },
			
        },

        series: [{
            name: 'Premium/Discount',
            type: 'spline',
            lineWidth: 3,
            data: jsonpdPoints
        }], 

		navigator: {
			enabled: false
		},
	
        rangeSelector: {
			inputDateFormat: '%m/%e/%Y',
		 //inputDateFormat: '%B %e, %Y',
         //inputEditDateFormat: '%B %e, %Y',
			x: -68,
			height: 75,
			inputStyle: {
            fontFamily: '"Allianz Neo", sans-serif',
            fontSize: '18px', 
            color: '#3c3c3c', 
            fontWeight: 'normal',
			pointerEvents: 'none'
			},
			labelStyle: {
            fontFamily: '"Allianz Neo", sans-serif',
            fontSize: '18px', 
            color: '#3c3c3c', 
            fontWeight: 'normal',
			},			
			enabled: true,		
            allButtonsEnabled: true,							
			verticalAlign: 'top',
			buttonPosition: {
			align: 'right'
			},
			inputPosition: {
			align: 'left'
			},
            buttons: [{
				type: 'month',
				count: 1,
				text: '1m',
				title: 'View 1 month'
			}, {
				type: 'month',
				count: 3,
				text: '3m',
				title: 'Q1'
			}, {
				type: 'month',
				count: 6,
				text: '6m',
				title: 'Q2'
			}, {
				type: 'ytd',
				text: 'YTD',
				title: 'View year to date'
			}, {
				type: 'year',
				count: 1,
				text: '1y',
				title: 'View 1 year'
			}, {
				type: 'all',
				text: 'All',
				title: 'View all'
			}],
            buttonTheme: {
                //width: 60,
				style: {
					display: 'none'
					}
            },
            selected: 5
        },		
		
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500,
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                    }
                }
            }]
        }

    });
}

function LOADfail(){

}