$( document ).ready(function() {
	$.getJSON('/sloth/get/search' + window.location.search, function(json){
		if (json.length == 0){
			let result = $(`
			  <div class="ui cards">
				<div class="card">
					<div class="content">
						<div class="header shopTitle">抱歉 沒有查到任何東西喔</div>
					</div>
				</div>
			  </div>
			`)
			$('#courseList').append(result)
		}

		for(let i of json){
			let result = $(`
			  <div class="ui cards">
					<div class="card">
					<div class="content">
						<a class="avatar" href="">
  							<img class="right floated mini ui image" src="">
  						</a>
  						<a class="avatar" href="">
  							<div class="header shopTitle"></div>
  						</a>
  						<div class="meta type">{# 課程的類型 #}</div>
  						<div class="description" id='School_teacher'></div>
					</div>
					<div class="extra content">
  						<span class="right floated">
  							<i class="ui red heart outline like icon"></i>
  							<span id='feedback_amount'></span>
						</span>
					</div>	
					</div>
				</div>
			`)
			School_teacher = $.parseHTML(`<p class="teacher">學校：${i['fields']['school']} 老師：${i['fields']['teacher']}</p>`)
			tmp = $.parseHTML(i['fields']['feedback_amount']+'人參與評分')
			result
			  .find('a.avatar').attr('href', '/infernoWeb/sloth/inside?id='+i['pk']).end()
			  .find('a.title').attr('href', '/infernoWeb/sloth/inside?id='+i['pk']).end()
			  .find('img').attr('src', i['fields']['avatar']).end()
			  .find('div.shopTitle').text(i['fields']['name']).end()
			  .find('div.type').text(i['fields']['ctype']).end()
			  .find('#School_teacher').html(School_teacher).end()
			  .find('#feedback_amount').html(tmp).end()
			$('#courseList').append(result)
		}

		let querystring = (new URL(location)).searchParams;
		$('#search-form').val(querystring.get('keyword'))
	})
})