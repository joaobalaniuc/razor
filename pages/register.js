
// SUBMIT FORM
$$('[data-name="register"]').on("submit", "form", function(e){
  e.preventDefault();
  if ($("#pass1").val()!=$("#pass2").val()) {
    app.dialog.alert('As senhas não coincidem.');
    return false;
  }
  userInsert();
});

// INSERT USER
function userInsert() {
  // DATA TO SEND
  var data_form = $("form").serialize();
  var data = data_form;
  console.log(data);

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_insert.php",
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
        localStorage.cli_phone = res.phone;
        app.router.navigate("/home/");
      }

    } // res not null
  }); // after ajax
}
