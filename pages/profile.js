$$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  userRead();
});

function userRead() {

  var fn = Hello();

  // DATA TO SEND
  var data = ajaxUserData();

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_read.php",
    data: data
  })
  .done(function (res) {
    txtPhone();
    ajaxLog(fn, res);
    if (!ajaxError(res)) { if (typeof cb === "function") { cb(res); } }
  }); // after ajax
}
