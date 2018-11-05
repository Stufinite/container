$( document ).ready(function() {
	function pagination(category, length){
		let querystring = (new URL(location)).searchParams;
		var startID = querystring.get('start')
		var start = (querystring.get('start')-1)/10+1
		let end = start + 11 < length ? start + 11 : length

		$('.borderless.menu').append($(`<a class="item" id='turnleft'><i class="angle left icon"></i></a>`))
		for(var i=start-1;i<end;i++){
			let item = $(`<a class="item">${i+1}</a>`)
			if(i+1==start){
				item.attr("class", "item active")
			}
			item.attr('href', `/infernoWeb/arrogant?start=${i*10+1}&category=${category}`)
			$('.borderless.menu').append(item)					
		}
		$('.borderless.menu').append($(`<a class="item" id='turnright'><i class="angle right icon"></i></a>`))

		$('#turnleft').click(function(){
			window.location.href = `/infernoWeb/arrogant?start=${parseInt(startID)-10}&category=${category}`
		})
		$('#turnright').click(function(){
			window.location.href = `/infernoWeb/arrogant?start=${parseInt(startID)+10}&category=${category}`

		})
	}
	$.getJSON('/arrogant/get/jcategory', function(json){
		for(let category of json){
			let tmp = $(`<a class="item" href="/infernoWeb/arrogant?start=1&category=${category['fields']['name']}">${category['fields']['name']}</a>`)
			$('#kind').append(tmp)
		}
	})

	$.getJSON('/arrogant/get/jlist' + window.location.search, function(json){
		first = json.shift()
		length = first['TotalPage']
		category = first['category']
		pagination(category, length)

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