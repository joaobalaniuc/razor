$$(document).on('page:init', '.page[data-name="turnon"]', function (e) {
  /*if (isApp) {
    if (typeof sessionStorage.user_lat === "undefined") { geo(); }
    push();
  }*/
  $("#preloader").fadeIn("fast");
  alert(0);
  geo();
  push();
  alert(1);
  setTimeout(function() {
    app.router.navigate("/home/");
  },5000);
});
