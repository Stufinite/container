function addMask() {
  $("body").append($("<div id='page-mask'>"));
}

function delMask() {
  $("body").find("#page-mask").remove();
}

function addEventListenerToDOM() {
  window.unsaved = false;
  window.onbeforeunload = unloadPage;

  // Login button
  var redirectURL = loginURL + "/fb?redirect_service=www";
  var fbURL = "https://www.facebook.com/v2.9/dialog/oauth?client_id=199021993947051&redirect_uri=" + redirectURL
  $('#fb-login-btn').attr('href', fbURL);
  $('#user-login-btn').attr('href', fbURL);

  $('.searchbar-toggle-btn').unbind().bind('click', (e) => {
    window.searchbar.show();
  });

  // Initialize user profile setting buttons
  $("#user-profile-setting-btn").unbind().bind("click", (e) => {
    if (window.userName == 'Guest') {
      guest();
    } else {
      editUser();
    }
  });
  $("#user-login-cancel-btn").unbind().bind("click", (e) => {
    closePrompt();
  });

  // Initialize course info close button
  $(".stufinite-course-info-close").unbind().bind("click", (e) => {
    $('.stufinite-course-info-container').hide();
  });
}


function unloadPage() {
  if (window.unsaved) {
    return "您還沒儲存課表喔，確定離開嘛?";
  }
}

function closePrompt() {
  $('#prompt-login').hide();
  $('#stufinite-create-user-profile').hide();
  delMask();
}

function promptUserLogin() {
  addMask();
  $('#prompt-login').show();
}

function promptUserprofile(func) {
  addMask();
  $('#stufinite-create-user-profile').show();
  $('#user-profile-department').empty();
  // Retrieve department list
  let careerMap = {
    'U': '學士學位',
    'G': '碩士學位',
    'D': '博士學位',
    'R': '在職專班',
    'W': '在職專班',
    'N': '進修學士學位'
  };
  let departmentList = {};
  $.getJSON('/static/timetable/json/NCHU/Department.json', (response) => {
    for (let career of response) {
      departmentList[career.degree] = career.department;
      $('#user-profile-career').append(
        $('<option>').val(career.degree).text(careerMap[career.degree])
      );
    }
    for (let department of departmentList[$('#user-profile-career').val()]) {
      $('#user-profile-department').append(
        $('<option>').val(department.value).text(department.zh_TW)
      );
    }
  });

  // Update deaprtment list after career change
  $('#user-profile-career').unbind()

  .bind('change', () => {
    $('#user-profile-department').empty();
    for (let department of departmentList[$('#user-profile-career').val()]) {
      $('#user-profile-department').append(
        $('<option>').val(department.value).text(department.zh_TW)
      );
    }
  });

  // Close prompt and update global user info
  $('#user-profile-btn').unbind().bind('click', () => {
    window.userName = "Guest";
    window.cpUser = {
      "id": "",
      "name": "Guest",
      "selected": [],
      "school": $("#user-profile-school").val(),
      "career": $('#user-profile-career').val(),
      "grade": $('#user-profile-grade').val(),
      "major": $('#user-profile-department').val()
    }

    func();
    delMask();
    $('#stufinite-create-user-profile').hide();
    $("#user-profile-cancel-btn").hide()
  });

  // Close prompt
  $('#user-profile-cancel-btn').unbind().bind('click', () => {
    delMask();
    $('#stufinite-create-user-profile').hide();
    $("#user-profile-cancel-btn").hide()
  });
}


function guest() {
  promptUserprofile(() => {
    init();
  });
}

function editUser() {
  $("#user-profile-cancel-btn").show()

  promptUserprofile(() => {
    $.ajax({
      url: '/api/user/edit',
      method: 'POST',
      data: {
        csrfmiddlewaretoken: getCookie('csrftoken'),
        key: window.userVerify,
        id: window.userId,
        school: cpUser.school,
        career: cpUser.career,
        major: cpUser.major,
        grade: cpUser.grade
      },
      success: (res) => {
        window.cpUser.id = window.userId;
        window.cpUser.name = window.userName;

        $.ajax({
          url: "/api/get/selected_course",
          method: "POST",
          data: {
            csrfmiddlewaretoken: getCookie('csrftoken'),
            id: window.userId,
            semester: '1071'
          },
          dataType: "text",
          success: (res) => {
            window.cpUser.selected = JSON.parse(res)
            init();
          },
          error: (res) => {
            window.cpUser.selected = [];
            init();
            console.log(res);
          }
        });
      },
      error: (res) => {
        console.log(res)
      }
    });
  });
}

function loadUser(user) {
  $.ajax({
    url: "/api/get/selected_course",
    method: "POST",
    data: {
      csrfmiddlewaretoken: getCookie('csrftoken'),
      id: user.id,
      semester: '1071'
    },
    dataType: "text",
    success: (res) => {
      window.cpUser = {
        id: user.id,
        username: user.name,
        selected: JSON.parse(res),
        school: user.profile.school,
        career: user.profile.career,
        grade: user.profile.grade,
        major: user.profile.major
      }
      init();
    },
    error: (res) => {
      window.cpUser = {
        id: user.id,
        username: user.name,
        selected: [],
        school: user.profile.school,
        career: user.profile.career,
        grade: user.profile.grade,
        major: user.profile.major
      }
      init();
      // console.log(res);
    }
  });
}


function getCookie(name) {
  //name should be 'csrftoken', as an argument to be sent into getCookie()
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

