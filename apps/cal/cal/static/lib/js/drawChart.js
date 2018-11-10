var infernoURL = "http://test.localhost.course.campass.com.tw:8080";

function drawChart(id) {
  async function run(){
    function getCourseInfo(){
        // id = location.search.split('id=')[1]
        return new Promise(function(resolve, reject){
            $.getJSON(infernoURL + "/sloth/get/cvalue?id="+id, function( j ) {
            }).done(result => {
                resolve(result);
            });
        });
    }
    var result = await getCourseInfo();
    data = [
      {
          axes: [
          {axis: "自由", value: result['feedback_freedom']},
          {axis: "知識性", value: result['feedback_knowledgeable']},
          {axis: "氛圍", value: result['feedback_FU']},
          {axis: "成績", value: result['feedback_GPA']},
          {axis: "簡單", value: result['feedback_easy']}
          ]
      }
    ]

    var chart = RadarChart.chart();
    chart.config({
      containerClass: 'radar-chart', // target with css, the default stylesheet targets .radar-chart
      w: 200,
      h: 200,
      factor: 0.9,
      factorLegend: 1,
      levels: 5,
      maxValue: 5,
      minValue: 0,
    });

    var svg = d3.select('.chart-container').append('svg')
      .attr('width', 260)
      .attr('height', 220);

    // draw one
    svg = svg.append('g').classed('focus', 3).datum(data)
    svg.call(chart)
    d3.selectAll(".axis text").style("font-size","14px")
  }
  run();

}
