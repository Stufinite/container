class StufiniteTimetable {
  constructor() {
    this.target = $("#time-table");
    this.semester = '1071';
    this.school = window.cpUser.school
    this.language = "zh_TW";
    this.credits = 0;

    this.user = window.cpUser;

    this.obligatory = {};
    this.optional = {};

    this.loadedObj = {};
    this.loadedCode = [];

    this.classroom = {};

    // Initialize classroom map
    $.getJSON('/static/timetable/json/NCHU/Classroom.json', (json) => {
      this.classroom = json;
    });

    this.initializeTimetableComponents();
    this.initializeMajorStuff();
  }

  initializeTimetableComponents() {
    // Attempt to login every 3 minutes
    setInterval(this.storeCourse.bind(this), 120000);

    // Initialize user profile setting buttons
    $("#save-course-btn").unbind().bind("click", (e) => {
      window.unsaved = false;

      if (this.user.name === 'Guest') {
        if (this.user.selected.length > 0) {
          document.cookie = "selected_course=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = 'selected_course=' + this.user.selected.toString();
        }
        promptUserLogin();
      } else {
        this.storeCourse();
      }
    });

    // Initialize timetable with square plus buttons
    $("#time-table td")
      .html($('<i class="fa fa-plus-square fa-5x"></i>')
        .on("mousedown", (e) => {
          $(e.target).css("color", "black")
        })
        .on("mouseup", (e) => {
          $(e.target).removeAttr("style")
        })
        .on("click", this.addCourseToSearchbar.bind(this)));
  }

  initializeMajorStuff() {
    this.getCourseByMajor((json) => {
      // Build major course index
      this.obligatory = {};
      this.optional = {}
      for (let i in json['obligatory']) {
        this['obligatory'][i] = json['obligatory'][i];
      }
      for (let i in json['optional']) {
        this['optional'][i] = json['optional'][i];
      }

      // Check if there are courses selected
      let s_list = [];
      if (this.user.selected.length == 0) {
        try {
          s_list = getCookie('selected_course').split(',');
        } catch (err) {
          // pass
        }
      } else {
        // Add selected courses to timetable
        s_list = this.user.selected;
      }
      this.user.selected = [];
      if (s_list.length == 0) {
        // Add major courses to timetable
        this.getMultipleCourseByCode(this.addCourse.bind(this), this['obligatory'][this.user.grade]);
      } else {
        this.getMultipleCourseByCode(this.addCourse.bind(this), s_list);
      }
      document.cookie = "selected_course=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Add major courses to searchbar
      for (let grade in this['obligatory']) {
        this.getMultipleCourseByCode((course) => {
          window.searchbar.addResult(course, undefined, grade);
        }, this['obligatory'][grade]);
      }
      for (let grade in this['optional']) {
        this.getMultipleCourseByCode((course) => {
          window.searchbar.addResult(course, undefined, grade);
        }, this['optional'][grade]);
      }

    });
  }

  setCredit(num) {
    $("#credits").text(parseInt(num, 10));
    return num;
  }

  addCredit(num) {
    this.credits += parseInt(num, 10);
    this.setCredit(this.credits)
  }

  subCredit(num) {
    this.credits -= parseInt(num, 10);
    this.setCredit(this.credits)
  }

  isCourseObligatory(code) {
    for (let i in this.obligatory) {
      for (let j in this.obligatory[i]) {
        if (this.obligatory[i][j] == code) {
          return true;
        }
      }
    }
    return false;
  }

  isCourseOptional(code) {
    for (let i in this.optional) {
      for (let j in this.optional[i]) {
        if (this.optional[i][j] == code) {
          return true;
        }
      }
    }
    return false;
  }

  isCodeLoaded(code) {
    for (let i in this.loadedCode) {
      if (this.loadedCode[i] == code) {
        return true;
      }
    }
    return false;
  }

  isCodeSelected(code) {
    for (let i in this.user.selected) {
      if (this.user.selected[i] == code) {
        return true;
      }
    }
    return false;
  }

  isCourseSelected(course) {
    for (let i in this.user.selected) {
      if (this.user.selected[i] == course.code) {
        return true;
      }
    }
    return false;
  }

  isCourseConflict(course) {
    let flag = false;
    let target = this.target
    let language = this.language
    $.each(this.getCourseTimeArray(course), function(_, iv) {
      $.each(iv.time, function(_, jv) {
        var $td = target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day - 1) + ')');
        if ($td.text() != "") { //用來判斷td裡面是不已經有放過課程了，但若先在裡面放個按鈕那.text()回傳回來的也是空字串
          flag = true;
          return;
        }
      });
      if (flag == true) {
        return;
      }
    });
    return flag;
  }

  getCourseByMajor(method) {
    $.getJSON('/course/CourseOfDept/?dept=' + this.user.major + '&school=' + this.school, method);
  }

  getCourseByCode(method, key) {
    if (this.isCodeLoaded(key)) {
      method(this.loadedObj[key]);
    } else {
      $.getJSON('/api/get/course/code/' + key, (course) => {
        this.loadedCode.push(key);
        this.loadedObj[key] = course[0];
        method(course[0]);
      });
    }
  }

  getMultipleCourseByCode(method, keys) {
    let keysString = ''
    for (let k of keys) {
      if (this.isCodeLoaded(k)) {
        method(this.loadedObj[k]);
        continue;
      }
      keysString = keysString + k + '+'
    }
    keysString = keysString.substr(0, keysString.length - 1);
    $.getJSON('/api/get/course/code?code=' + keysString + '&semester=' + this.semester, (courses) => {
      for (let c of courses) {
        this.loadedCode.push(c.code);
        this.loadedObj[c.code] = c;
        method(c);
      }
    });
  }

  getCourseLocationString(location) {
    if (location != "") {
      for (let c in this.classroom) {
        let index = 0;
        for (let i = 0; i < location.length; i++) {
          // Find code of the building
          if (!isNaN(location.charAt(i))) {
            index = i;
            break;
          }
        }
        if (location.slice(0, index) == c) {
          return this.classroom[c] + location.slice(index, location.length)
        }
      }
    }
    return location;
  }

  getCourseTimeString(course) {
    if (course.time == "" || course.time == undefined) {
      return "無上課時間";
    }
    let time = this.getCourseTimeArray(course);
    let dayChar = ['一', '二', '三', '四', '五', '六', '日'];
    let result = ''
    for (let d of time) {
      result += dayChar[parseInt(d.day, 10) - 1] + ' ';
      for (let h of d.time) {
        result += h + ' '
      }
      result += ', '
    }
    return result.slice(0, -3);
  }

  getCourseTimeArray(course) {
    let time = course.time;
    let timesOfCourse = time.split(',')

    let result = []
    for (let timesByDay of timesOfCourse) {
      let formattedTime = {
        'time': []
      }
      let t = timesByDay.split('-')
      formattedTime['day'] = t.shift()
      while (t.length != 0) {
        formattedTime['time'].push(t.shift())
      }
      result.push(formattedTime)
    }

    return result
  }

  getCourseType(course) {
    if (this.isCourseObligatory(course.code)) {
      return '.obligatory';
    } else if (this.isCourseOptional(course.code)) {
      return '.optional';
    } else {
      if (course.discipline != undefined && course.discipline != "") {
        let types = {
          "文學學群": ".human",
          "歷史學群": ".human",
          "哲學學群": ".human",
          "藝術學群": ".human",
          "文化學群": ".human",
          "公民與社會學群": ".society",
          "法律與政治學群": ".society",
          "商業與管理學群": ".society",
          "心理與教育學群": ".society",
          "資訊與傳播學群": ".society",
          "生命科學學群": ".nature",
          "環境科學學群": ".nature",
          "物質科學學群": ".nature",
          "數學統計學群": ".nature",
          "工程科技學群": ".nature"
        };
        return course.discipline in types ?
          types[course.discipline] :
          '.others';
      } else {
        let types = {
          "語言中心": ".english",
          "夜共同科": ".english",
          "夜外文": ".english",
          "通識教育中心": ".chinese",
          "夜中文": ".chinese",
          "體育室": ".PE",
          "教官室": ".military-post",
          "師資培育中心": ".teacher-post"
        };
        return course.department in types ?
          types[course.department] :
          ".others";
      }
    }
  }

  addCourseToDetail(course) {
    $(".chart-container").children().remove();
    $.getJSON(infernoURL + `/sloth/get/search?school=nchu&keyword=${course.title[this.language]}&teacher=${course['professor']}`, () => {})
      .done(res => {
        drawChart(res[0].pk);
        $('#course-review').attr('target', "_blank").attr('href', infernoURL + '/infernoWeb/sloth/inside?id=' + res[0].pk);
      });

    $('.stufinite-course-info-container > .title-container > .title').text(course.title[this.language]);
    $('.stufinite-course-info-container > .title-container > .professor').text('指導教授：' + course.professor);
    $('#add-to-timetable').unbind().bind('click', () => {
      this.getCourseByCode(this.addCourse.bind(this), course.code);
      window.searchbar.hide();
      $('.stufinite-course-info-container').hide();
    });

    let $detail = $(`
          <li>開設系所： <span class='detail-department'></span></li>
          <li>課程代碼： <span class='detail-code'></span></li>
          <li>選修學分： <span class='detail-credits'></span></li>
          <li>上課地點： <span class='detail-location'></span></li>
          <li>先修科目： <span class='detail-prerequisite'></span></li>
          <li>課程備註： <span class='detail-note'></span></li>
          `)
      .find(".detail-department").text(course.department).end()
      .find(".detail-code").text(course.code).end()
      .find(".detail-credits").text(course.credits).end()
      .find(".detail-location").text(this.getCourseLocationString(course.location) == '' ? '無上課地點' : this.getCourseLocationString(course.location)).end()
      .find(".detail-prerequisite")
      .text(course.prerequisite == undefined || course.prerequisite == "" ? "無" : course.prerequisite).end()
      .find(".detail-note")
      .text(course.note == undefined || course.note == "" ? "無" : course.note).end()
    $("#course-detail").html($detail)
    $(".stufinite-course-info-container").show();
  }

  addCourseToSearchbar(e) {
    let day = $(e.target).closest("td").attr("data-day");
    let hour = $(e.target).closest("tr").attr("data-hour");

    $.getJSON('/course/TimeOfCourse/?school=' + this.school + '&degree=O+' + this.user.career + '&day=' + day + '&time=' + hour + '&dept=C00+' + this.user.major, (codes) => {
      window.searchbar.clear();
      this.getMultipleCourseByCode(window.searchbar.addResult.bind(window.searchbar), codes);
      window.searchbar.show();
    });
  }

  addCourse(course) {
    if (this.isCourseSelected(course)) {
      toastr.warning(this.language == "zh_TW" ?
        course.title[this.language] + " 已加選" :
        "This course is selected.", {
          timeOut: 2500
        });
      return;
    } else if (this.isCourseConflict(course)) {
      toastr.error(this.language == "zh_TW" ?
        course.title[this.language] + " 衝堂喔！請手動刪除衝堂的課程" :
        "Conflict! please drop some course manually.", {
          timeOut: 2500
        });
      return;
    } else if (course.time == '') {
      toastr.warning(this.language == "zh_TW" ?
        course.title[this.language] + " 無上課時間" :
        "This course has no time.", {
          timeOut: 2500
        });
      return;
    }

    for (let courseByDay of this.getCourseTimeArray(course)) {
      for (let courseByTime of courseByDay.time) {
        let $cell = $(`
                    <div class="course">
                        <i class="detail fa fa-book" aria-hidden="true"></i>
                        <i class="remove fa fa-trash" aria-hidden="true"></i>
                        <span class="title"></span>
                        <span class="professor"></span>
                        <span class="location"></span>
                    </div>`)
        let $td = this.target.find('tr[data-hour="' + courseByTime + '"] td:eq(' + (courseByDay.day - 1) + ')');

        $cell
          .find('.detail').unbind().bind('click', (e) => {
            this.addCourseToDetail(course)
          }).end()
          .find('.remove').unbind().bind('click', (e) => {
            this.delCourse(course)
          }).end()
          .find('.title').text(course.title[this.language]).end()
          .find('input').val(course.code).end()
          .find('.professor').text(course.professor).end().find('.location').end()
          .attr('code', course.code)

        $td.html($cell);
      }
    }

    this.addCredit(course.credits);
    this.user.selected.push(course.code);

    window.unsaved = true;
  }

  delCourse(course) {
    let target = this.target;
    let major = this.user['major'].split(" ")[0];

    if (this.isCourseObligatory(course.code)) {
      toastr.warning(this.language == "zh_TW" ?
        "此為必修課，若要復原請點擊課表空格" :
        "This is a required course, if you want to undo, please click the \"plus\" symbol", {
          timeOut: 2500
        });
    }

    $.each(this.getCourseTimeArray(course), (_, iv) => {
      $.each(iv.time, (_, jv) => {
        var $td = target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day - 1) + ')');
        //td:eq()為搜尋td的陣列索引值，找到課程的時間    iv.day為星期，但因為td為陣列所以iv.day要減一    find()是找class!!
        $td.html($('<i class="fa fa-plus-square fa-5x"></i>').unbind().bind('click', this.addCourseToSearchbar.bind(this)));
      })
    })

    this.subCredit(course.credits);
    var index = this.user.selected.indexOf(course.code);
    if (index > -1) {
      this.user.selected.splice(index, 1);
    }

    window.unsaved = true;
  }

  storeCourse() {
    $.ajax({
      url: "/api/store/selected_course",
      method: "POST",
      data: {
        id: this.user.id,
        selected: this.user.selected.toString(),
        semester: this.semester,
        csrfmiddlewaretoken: getCookie('csrftoken')
      },
      dataType: "text",
      success: (res) => {
        if (JSON.parse(res)['state'] == 'ok') {
          toastr.success(this.language == "zh_TW" ?
            "成功儲存課表" :
            "Timetable is saved", {
              timeOut: 2500
            });
        }
      }
    });
  }
}
