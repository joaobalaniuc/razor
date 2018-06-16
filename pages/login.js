//================================================
// SUBMIT FORM
//================================================
$$('[data-name="login"]').on("submit", "form", function(e){
  e.preventDefault();
  userLogin();
});
//================================================
// LOGIN
//================================================
function userLogin() {

  // DATA TO SEND
  var data_form = $("form").serialize();
  var data = data_form;
  console.log(data);

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_login.php",
    data: data,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: localStorage.timeout
  })
  .always(function () {
    app.preloader.hide();
  })

  .fail(function () {
    app.dialog.alert('Desculpe, a conexão falhou. Tente novamente mais tarde.');
  })

  .done(function (res) {
    if (res !== null) {
      console.log(res);
      if (res.error) {
        app.dialog.alert(res.error, 'Ops!');
        return;
      }
      if (res.success) {
        localStorage.cli_id = res.id;
        localStorage.cli_email = res.email;
        localStorage.cli_pass = res.pass;
        app.router.navigate("/home/");
      }

    } // res not null
  }); // after ajax
}
