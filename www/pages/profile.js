$$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  userRead(userReadCb);
  $("[name=cli_id]").val(localStorage.cli_id);
});

$$(document).on('click', '#profileButton', function (e) {
  $("#profileShow").fadeOut("fast", function() {
    $("#profileForm").fadeIn("fast");
  });
});

$$(document).on('click', '#profileCancel', function (e) {
  $("#profileForm").fadeOut("fast", function() {
    $("#profileShow").fadeIn("fast");
  });
});

$$(document).on('click', '#logout', function (e) {
  app.dialog.confirm('Tem certeza que deseja sair?', function () {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href="index.html";
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
