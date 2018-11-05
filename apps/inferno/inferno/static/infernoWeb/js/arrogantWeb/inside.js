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
      function getjobValue(){
          id = location.search.split('id=')[1]
          return new Promise(function(resolve, reject){
              $.getJSON( "/arrogant/get/jvalue?id="+id, function( j ) {
              }).done(result => {
                  resolve(result);
              });
          });
      }
      function renderjobInfo(json){
        $('body').find('#goyourator').attr('href', 'https://www.yourator.co' + json['path']).end()
        $('body').find('#gocompany').attr('href', 'https://www.yourator.co' + json['company']['path']).end()


        let result = $(`
          <div class="eight wide column" id="profile">
            <h3 class="ui header" id='name'></h3>
            <p class="cinema">
              薪水：<span id='salary'></span><br>
              公司：<span id='teacher'></span><br>
              地址：<span id='ctype'></span><br>
              職務類型：<span id='book'></span><br>
              Job Tag：<span id='dept'></span><br>
              公司規模：<span id='公司規模'></span><br>
              資本額：<span id='資本額'></span><br>
              description：<span id='description'></span><br>
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
          .find('#ctype').text(json['company']['地址']).end()
          .find('#teacher').text(json['company']['brand']).end()
          .find('#book').text(json['Category']['name']).end()
          .find('#dept').text(json['JobTag'].length != 0 ? json['JobTag'].map((obj)=>obj['name']) : '無').end()
          .find('#feedback_amount').text(json['feedback_amount']).end()
          .find('#salary').text(json['salary']).end()
          .find('#公司規模').text(json['company']['公司規模']).end()
          .find('#資本額').text(json['company']['資本額']).end()
          .find('#description').text(json['company']['description']).end()

        if(json['skilltag'].length!=0){
          result
            .find('.cinema').append('skill：' + json['skilltag'].map((x)=>x['name']))
        }

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
      function renderjobRadar(json){
        data = [
          {
              axes: [
              {axis: "工作內容", value: json['feedback_freedom']},
              {axis: "工時", value: json['feedback_knowledgeable']},
              {axis: "環境", value: json['feedback_FU']},
              {axis: "薪資", value: json['feedback_salary']},
              {axis: "公司福利", value: json['feedback_easy']}
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
      var job = await getjobValue();
      renderjobInfo(job);
      renderjobRadar(job);
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
          $.getJSON('/arrogant/get/comment' + window.location.search + '&start=1', function(json){
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
                <b>同學</b><p class="author"></p>
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
            .find('a.red.labeled.icon.button').attr('value', '/arrogant/post/like?id='+j['pk']).end()
            .find('b').text(j['fields']['author'][0][0] + '同學').end()
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
        $.post( '/arrogant/post/questionnaire' + window.location.search, Object.assign(res, postdata))
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