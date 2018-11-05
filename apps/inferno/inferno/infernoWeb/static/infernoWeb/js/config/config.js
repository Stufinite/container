window.DEBUG = false;
// window.DEBUG = true;

if (window.DEBUG) {
  window.loginURL = 'http://test.localhost.login.campass.com.tw:8080';
  window.infernoURL = "http://test.localhost.course.campass.com.tw:8080";
} else {
  window.loginURL = 'http://login.campass.com.tw';
  window.infernoURL = 'http://course.campass.com.tw';
}