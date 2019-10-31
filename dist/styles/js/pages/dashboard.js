$(function(){"use strict";$(".connectedSortable").sortable({placeholder:"sort-highlight",connectWith:".connectedSortable",handle:".box-header, .nav-tabs",forcePlaceholderSize:!0,zIndex:999999}),$(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor","move"),$(".todo-list").sortable({placeholder:"sort-highlight",handle:".handle",forcePlaceholderSize:!0,zIndex:999999}),$(".textarea").wysihtml5(),$(".daterange").daterangepicker({ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},startDate:moment().subtract(29,"days"),endDate:moment()},function(e,t){window.alert("You chose: "+e.format("MMMM D, YYYY")+" - "+t.format("MMMM D, YYYY"))}),$(".knob").knob();var e={US:398,SA:400,CA:1e3,DE:500,FR:760,CN:300,AU:700,BR:600,IN:800,GB:320,RU:3e3};$("#world-map").vectorMap({map:"world_mill_en",backgroundColor:"transparent",regionStyle:{initial:{fill:"#e4e4e4","fill-opacity":1,stroke:"none","stroke-width":0,"stroke-opacity":1}},series:{regions:[{values:e,scale:["#92c1dc","#ebf4f9"],normalizeFunction:"polynomial"}]},onRegionLabelShow:function(t,o,i){void 0!==e[i]&&o.html(o.html()+": "+e[i]+" new visitors")}});var t=[1e3,1200,920,927,931,1027,819,930,1021];$("#sparkline-1").sparkline(t,{type:"line",lineColor:"#92c1dc",fillColor:"#ebf4f9",height:"50",width:"80"}),t=[515,519,520,522,652,810,370,627,319,630,921],$("#sparkline-2").sparkline(t,{type:"line",lineColor:"#92c1dc",fillColor:"#ebf4f9",height:"50",width:"80"}),t=[15,19,20,22,33,27,31,27,19,30,21],$("#sparkline-3").sparkline(t,{type:"line",lineColor:"#92c1dc",fillColor:"#ebf4f9",height:"50",width:"80"}),$("#calendar").datepicker(),$("#chat-box").slimScroll({height:"250px"});var o=new Morris.Area({element:"revenue-chart",resize:!0,data:[{y:"2011 Q1",item1:2666,item2:2666},{y:"2011 Q2",item1:2778,item2:2294},{y:"2011 Q3",item1:4912,item2:1969},{y:"2011 Q4",item1:3767,item2:3597},{y:"2012 Q1",item1:6810,item2:1914},{y:"2012 Q2",item1:5670,item2:4293},{y:"2012 Q3",item1:4820,item2:3795},{y:"2012 Q4",item1:15073,item2:5967},{y:"2013 Q1",item1:10687,item2:4460},{y:"2013 Q2",item1:8432,item2:5713}],xkey:"y",ykeys:["item1","item2"],labels:["Item 1","Item 2"],lineColors:["#a0d0e0","#3c8dbc"],hideHover:"auto"}),i=new Morris.Line({element:"line-chart",resize:!0,data:[{y:"2011 Q1",item1:2666},{y:"2011 Q2",item1:2778},{y:"2011 Q3",item1:4912},{y:"2011 Q4",item1:3767},{y:"2012 Q1",item1:6810},{y:"2012 Q2",item1:5670},{y:"2012 Q3",item1:4820},{y:"2012 Q4",item1:15073},{y:"2013 Q1",item1:10687},{y:"2013 Q2",item1:8432}],xkey:"y",ykeys:["item1"],labels:["Item 1"],lineColors:["#efefef"],lineWidth:2,hideHover:"auto",gridTextColor:"#fff",gridStrokeWidth:.4,pointSize:4,pointStrokeColors:["#efefef"],gridLineColor:"#efefef",gridTextFamily:"Open Sans",gridTextSize:10}),n=new Morris.Donut({element:"sales-chart",resize:!0,colors:["#3c8dbc","#f56954","#00a65a"],data:[{label:"Download Sales",value:12},{label:"In-Store Sales",value:30},{label:"Mail-Order Sales",value:20}],hideHover:"auto"});$(".box ul.nav a").on("shown.bs.tab",function(){o.redraw(),n.redraw(),i.redraw()}),$(".todo-list").todolist({onCheck:function(e){return window.console.log("The element has been checked"),e},onUncheck:function(e){return window.console.log("The element has been unchecked"),e}})});