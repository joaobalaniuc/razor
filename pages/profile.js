$$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  userRead(userReadCb);
  $("[name=cli_id]").val(localStorage.cli_id);
});

$$(document).on('click', '#profileButton', function (e) {
  $("#profileShow").fadeOut("slow", function() {
    $("#profileForm").fadeIn("slow");
  });
});

$$(document).on('submit', '#profileForm', function (e) {
  e.preventDefault();
  sessionStorage.removeItem("pass1");
  var pass1 = $("#pass1").val();
  var pass2 = $("#pass2").val();
  if (pass1 != "") {
    if (pass1 != pass2) {
      app.dialog.alert("Os campos da nova senha não coincidem.", 'Ops!');
      return false;
    }
    else { sessionStorage.pass1 = pass1; }
  }
  sessionStorage.cli_email = $("#profileForm [name=cli_email]").val();
  userUpdate();
});
