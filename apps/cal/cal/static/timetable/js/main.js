(function main() {
  $.ajax({ // Get user from userpool
    url: loginURL + '/fb/user',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: (res) => {
      window.userId = res.id
      window.userName = res.name
      window.userVerify = res.verify

      if (res.profile == null) { // User is registered but never used cal
        editUser();
      } else { // Load user data normally
        loadUser(res);
      }
      // Change status of Facebook button
      $('#fb-login-btn').html('<i class="fa fa-facebook-square" aria-hidden="true"></i> 登出').attr('href', loginURL + '/fb/logout?redirect_service=www')
    },
    error: (res) => { // User is not logged in
      guest();
    }
  });

  addEventListenerToDOM();
})();

function init() {
  window.timetable = new StufiniteTimetable();
  window.searchbar = new StufiniteSearchbar();
  window.searchbar.show();
}
