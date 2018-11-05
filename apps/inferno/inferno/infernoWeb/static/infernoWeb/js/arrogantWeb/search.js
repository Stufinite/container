$( document ).ready(function() {

	// render category tag
	$.getJSON('/arrogant/get/jcategory', function(json){
		for(let category of json){
			let tmp = $(`<a class="item" href="/infernoWeb/arrogant?start=1&category=${category['fields']['name']}">${category['fields']['name']}</a>`)
			$('#kind').append(tmp)
		}
	})

	$.getJSON('/arrogant/get/search' + window.location.search, function(json){
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
  							<i class="ui red heart icon"></i>
  							<span id='feedback_amount'></span>
						</span>
					</div>	
					</div>
				</div>
			`)
			School_teacher = $.parseHTML(`<p class="teacher">${i['company']['brand']} 地區：${i['company']['area']}</p>`)
			tmp = $.parseHTML(i['feedback_amount']+'人參與評分')
			result
			  .find('a.avatar').attr('href', '/infernoWeb/arrogant/inside?id='+i['id']).end()
			  .find('img').attr('src', i['avatar']).end()
			  .find('div.shopTitle').text(i['name']).end()
			  .find('div.type').text(i['jobtag']).end()
			  .find('#School_teacher').html(School_teacher).end()
			  .find('#feedback_amount').html(tmp).end()
			$('#courseList').append(result)			
		}
	})
})