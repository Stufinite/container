window.DEBUG = false;
// window.DEBUG = true;

if (window.DEBUG) {
  var loginURL = 'http://test.localhost.login.campass.com.tw:8080';
  var infernoURL = "http://test.localhost.course.campass.com.tw:8080";
} else {
  var loginURL = 'http://login.campass.com.tw';
  var infernoURL = 'http://new.course.campass.com.tw';
}
