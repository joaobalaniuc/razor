$$(document).on('page:init', '.page[data-name="turnon"]', function (e) {
  sessionStorage.turnon = 1;
  $("#preloader").show();
  $("#syncArea").show();
});
//=====================================================
// GPS
//=====================================================
$$(document).on('click', '#turnonGps', function (e) {
  geo();
  $("#divGps").fadeOut("slow", function() {
    $("#divPush").fadeIn("slow");
  });
});
$$(document).on('click', '#ignoreGps', function (e) {
  $("#divGps").fadeOut("slow", function() {
    $("#divPush").fadeIn("slow");
  });
});
//=====================================================
// PUSH
//=====================================================
$$(document).on('click', '#turnonPush', function (e) {
  push();
  $("#divPush").fadeOut("slow", function() {
    //app.router.navigate("/home/");
  });
});
$$(document).on('click', '#ignorePush', function (e) {
  $("#divPush").fadeOut("slow", function() {
    app.router.navigate("/home/");
  });
});
