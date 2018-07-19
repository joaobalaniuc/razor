// Get token
function Auth(cb) {
  var fn = Hello();

  if (sessionStorage.online == "false") {
    setTimeout(function() {Auth(cb);},1000);
    return false;
  }

  // DATA TO SEND
  var user_data = ajaxUserData();
  var user_data = $.param(user_data);
  var dev_data = ajaxDevData();
  var dev_data = $.param(dev_data);
  var data = user_data + "&" + dev_data;
  alert(data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/hello.php",
    data: data,
    //beforeSend: function() {}, // não usar preloader
    error: function() {} // não usar fail default (alert)
  })
  .fail(function () {
    setTimeout(function() {
      Auth(cb);
    }, 3000);
    notificationConex.open();
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      //alert("token="+res.auth_token+" dev_id"+res.dev_id);
      sessionStorage.auth_token = res.auth_token;
      localStorage.dev_id = res.dev_id;
      if (typeof cb === "function") { cb(); }
    }
  }); // after ajax
}

function userLogin(cb) {

  var fn = Hello();

  // DATA TO SEND
  var data_form = $("#loginForm").serialize();
  var data_dev = ajaxDevData();
  var data_dev = $.param(data_dev);
  var data = data_form + "&" + data_dev;
  console.log(fn+" --> sending data: "+data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_login.php",
    data: data
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) { if (typeof cb === "function") { cb(res); } }
  }); // after ajax
}

function userLogout(local) {
  sessionStorage.clear();
  if (typeof local === "undefined") {
    localStorage.clear();
  }
  window.location.href="index.html";
}

// localStorage
function userSave(res) {
  localStorage.cli_id = res.cli_id;
  localStorage.cli_email = res.cli_email;
  localStorage.cli_pass = res.cli_pass;
  localStorage.cli_phone = res.cli_phone;
  localStorage.dev_id = res.dev_id;
  app.router.navigate("/home/");
}

function userInsert(cb) {

  var fn = Hello();

  // DATA TO SEND
  var data_form = $("#registerForm").serialize();
  var data_dev = ajaxDevData();
  var data_dev = $.param(data_dev);
  var data = data_form + "&" + data_dev;
  console.log(fn+" --> sending data: "+data);

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/user_insert.php",
    data: data,
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) { if (typeof cb === "function") { cb(res); } }
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

  $('[name=cli_name]').each(function(i) { $(this).html(res.cli_name); });
  $('[name=cli_email]').each(function(i) { $(this).html(res.cli_email); });
  $('[name=cli_phone]').each(function(i) { $(this).html(res.cli_phone); });
  $('[name=cli_date]').each(function(i) { $(this).html(res.cli_date); });
  $('.cel').each(function(i) { $(this).html(res.cli_phone); });
  initForm();
  txtPhone();
}

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
