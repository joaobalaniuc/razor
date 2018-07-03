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
        localStorage.cli_phone = res.phone;
        app.router.navigate("/home/");
      }

    } // res not null
  }); // after ajax
}

function userInsert() {

  // DATA TO SEND
  var data_form = $("#registerForm").serialize();
  var data = data_form;
  console.log(data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_insert.php",
    data: data,
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

function userRead(cb) {

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

    ajaxLog(fn, res);
    if (!ajaxError(res)) { if (typeof cb === "function") { cb(res); } }
  }); // after ajax
}

function userReadCb(res) {

  var fn = Hello();

  $('[name=cli_name]').each(function(i) { $(this).val(res.cli_name); });
  $('[name=cli_email]').each(function(i) { $(this).val(res.cli_email); });
  $('[name=cli_phone]').each(function(i) { $(this).val(res.cli_phone); });
  $('[name=cli_date]').each(function(i) { $(this).val(res.cli_date); });
  initForm();

}

// UPDATE USER
function userUpdate() {

  var fn = Hello();

  // DATA TO SEND
  var data = $("#profileForm").serialize();
  console.log(fn+" --> sending data: "+data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_update.php",
    data: data,
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) {
        if (typeof sessionStorage.pass1 !== "undefined") {
          localStorage.cli_pass = sessionStorage.pass1;
        }
        localStorage.cli_email = sessionStorage.cli_email;
        app.router.navigate("/home/");
      }
    } // res not null
  }); // after ajax
}
