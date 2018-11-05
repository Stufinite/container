/*************************************************************************/
(function activeMenu() {

  // selector cache
  var $menuItem = $('div.four.menu a.item')
  function activate() {
    $(this)
    .addClass('active')
    .closest('.ui.menu')
    .find('.item')
    .not($(this))
    .removeClass('active');
    for(let i of $('div.comments')){
      if ($(this).attr('emotion')=='all'){
        $(i).css('display', '')
      }
      else if ($(i).attr('emotion')==$(this).attr('emotion')){
        $(i).css('display', '')
      }
      else{
        $(i).css('display', 'none')
      }
    }
  }

  $menuItem
    .on('click', activate)
  ;

})();
/*************************************************************************/

$( document ).ready(function() {
    /************************畫雷達圖***************************/
    async function updateRadar(){
      function getCourseValue(){
          id = location.search.split('id=')[1]
          return new Promise(function(resolve, reject){
              $.getJSON( "/sloth/get/cvalue?id="+id, function( j ) {
              }).done(result => {
                  resolve(result);
              });
          });
      }
      function renderCourseInfo(json){
        let result = $(`
          <div class="eight wide column" id="profile">
            <h3 class="ui header" id='name'></h3>
            <p class="cinema">
              老師：<span id='teacher'></span><br>
              課程類型：<span id='ctype'></span><br>
              上課教材：<span id='book'></span><br>
              開課系所：<span id='dept'></span><br>
              評分方式：<span id='benchmark'></span>
            </p>
            <p>
              <i class="ui red heart outline like icon" aria-hidden="true"></i><span id='feedback_amount'></span>人參與評分
            </p>
          </div>
          <div class="eight wide column" id="chart-container"></div>
        `)
        result
          .find('#avatar').attr('src', json['avatar']).end()
          .find('#name').text(json['name']).end()
          .find('#teacher').text(json['teacher']).end()
          .find('#ctype').text(json['ctype']).end()
          .find('#book').text(json['book']).end()
          .find('#dept').text(json['dept']).end()
          .find('#benchmark').text(json['benchmark']).end()
          .find('#feedback_amount').text(json['feedback_amount']).end()
        $('#profile').empty()
        $('#profile').append(result)
        // semantic-ui activation function
        $('.rating').rating('setting', 'clearable', true);
        $('#goquestion').click(function(){
            if(window.res['id']==undefined){
                toastr.error('請登入後再參與評分')
                return
            }
            $('.modal')
              .modal('show')
            ;            
        })
      }
      function renderCourseRadar(json){
        data = [
          {
              axes: [
              {axis: "自由", value: json['feedback_freedom']},
              {axis: "知識性", value: json['feedback_knowledgeable']},
              {axis: "氛圍", value: json['feedback_FU']},
              {axis: "成績", value: json['feedback_GPA']},
              {axis: "簡單", value: json['feedback_easy']}
              ]
          }
        ]
        $('#chart-container').empty();
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

        var svg = d3.select('#chart-container').append('svg')
          .attr('width', 200)
          .attr('height', 200); 

        // draw one
        svg = svg.append('g').classed('focus', 3).datum(data)
        svg.call(chart)
        d3.selectAll(".axis text").style("font-size","14px")
      }
      var course = await getCourseValue();
      renderCourseInfo(course);
      renderCourseRadar(course);
    }
    /************************畫雷達圖***************************/
    async function run(){
      function getUser() {
        return new Promise(function(resolve, reject){
            let loginUrl = "http://login.campass.com.tw"
            $.ajax({
              url: loginUrl + '/fb/user',
              dataType: 'json',
              xhrFields: {
                withCredentials: true
              },
              success: (res) => {
                $('#fb-login-btn').html('<i class="fa fa-facebook-square" aria-hidden="true"></i>登出').attr('href', loginUrl + '/fb/logout?redirect_service=www');

                // if didn't have cookie, create user first and then assign cookie
                // else, only update cookie without post to createUser. Preventing our server overload.
                if(getCookie('id')!=res['id']){
                  $.post('/infernoWeb/createUser', Object.assign(res, {'csrfmiddlewaretoken':getCookie('csrftoken')}))
                  .done(function(response) {
                    document.cookie = `id=${res['id']}`;
                  })
                  .fail(function(response) {
                    console.log(response)
                  })
                }

                window.res = res;
                $.post(location.href, Object.assign(res, {'csrfmiddlewaretoken':getCookie('csrftoken')}));
                resolve(res)
              },
              error: (res) => {
                // User is not logged in
                window.res = {}
                resolve({})
              }
            }); 
        });
      };
      function getComments(){
        return new Promise(function(resolve, reject){
          // query留言api，自動生成出留言
          $.getJSON('/sloth/get/comment' + window.location.search + '&start=1', function(json){
              resolve(json);
          })
        })
      }
      function renderComments(json){
        $('#comments').empty();
        for (let j of json){
          let result = $(
          `
          <div class="ui comments" emotion="">
            <div class="comment">
              <a class="avatar">
                <img src='/media/student.png'>
              </a>
              <div class="content">
                <b>匿名</b><p class="author"></p>
                <div class="metadata">
                  <div class="date"></div>
                    <div class="rating">
                    </div>
                </div>
                <div class="text">
                  <pre class='raw'></pre>
                </div>
                <a class="ui basic red labeled icon button" value="">
                  <i class="heart icon"></i><span class="like"></span>
                </a>
              </div>
            </div>
          </div>
          `
          );
          result
            .find('div.date').text(j['fields']['create']).end()
            .find('pre.raw').text(j['fields']['raw']).end()
            .find('span.like').text(j['fields']['like']).end()
            .find('a.red.labeled.icon.button').attr('value', '/sloth/get/like?id='+j['pk']).end()
            // .find('b').text(j['fields']['author'][0][0] + '同學').end()
            .attr("emotion", j['fields']['emotion'])

          emojiTable = {
            'neutral':'<i class="meh icon"></i>中立',
            'pos':'<i class="smile icon"></i>正面',
            'neg':'<i class="frown icon"></i>反面'
          }
          result.find('div.rating').html(emojiTable[j['fields']['emotion']])

          for(let i of j['fields']['likesfromuser']){
            if (window.res['id'] == i) {
              result.find('a').attr('already', 'True')
              result.find('a').removeClass('basic');
            }              
          }
          $('#comments').append(result)
        }
      }
      var user = await getUser();
      var comments = await getComments();
      renderComments(comments);
    }
    run();
    updateRadar();

    $('body').on('click', 'a.red.labeled.icon.button', function(event) {
      var target = $(this)
      if(window.res['id']==undefined){
          toastr.error('請登入後再按讚');
          return;
      }
      var copy = Object.assign({}, res);
      if(target.attr('already')=='True'){
        $.post($(this).attr('value'), Object.assign(copy, {'csrfmiddlewaretoken':getCookie('csrftoken'),'like':-1}))
        .done(function() {
          tmp = target.find('span.like').text()
          target.find('span.like').text(Number(tmp) + -1)
          target.attr('already', 'False')
          target.addClass('basic');
        })
        .fail(function() {
          toastr.error('請檢查是否登入，或是重新整理頁面')
        })
      }
      else{
        $.post($(this).attr('value'), Object.assign(copy, {'csrfmiddlewaretoken':getCookie('csrftoken'),'like':1}))
        .done(function() {
          tmp = target.find('span.like').text()
          target.find('span.like').text(Number(tmp) + 1)
          target.attr('already', 'True')
          target.removeClass('basic');
        })
        .fail(function() {
          toastr.error('請檢查是否登入，或是重新整理頁面')
        })
      }
    });
    // 提交心得表單
    $('#questionnaire').click(function() {
        // 取得semantic-ui的星星評分的value
        let value = $('.ui.rating')
          .rating('get rating').map(Number);
        let postdata = {
            'csrfmiddlewaretoken':getCookie('csrftoken'),
            'rating':JSON.stringify(value),
        }
        // pathname + search 就等於url pattern + querystring            
        $.post( '/sloth/get/questionnaire' + window.location.search, Object.assign(res, postdata))
        .done(function(response) {
            if(response['alreadySubmit']==true){
              toastr.warning('SORRY 目前只開放提交一次喔~~ 未來會再依照情況調整')                  
            }
            else if(response['submitSuccess']==true){
              toastr.success('問卷提交成功')
              updateRadar();                  
            }
            else{
              toastr.error('發生奇怪的事情，請聯絡管理員')                  
            }
        })
        .fail(function() {
            toastr.error('請檢查是否登入或是重新整理頁面')
        })
        .always(function() {
        });               
    });
});