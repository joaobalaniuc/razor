$$(document).on('page:init', '.page[data-name="sync"]', function (e) {

  // AUTO_ID?
  if (typeof sessionStorage.auto_id === "undefined") {
    app.dialog.alert('Desculpe, ocorreu um erro interno.');
  }
  // AUTO_NAME
  $(".auto_name").html(sessionStorage.auto_name);
});

// SUBMIT FORM
$$('[data-name="sync"]').on("submit", "form", function(e){
  e.preventDefault();
  devInsert();
});

// MAIS OPÇÕES
$$('[data-name="sync"]').on("click", "#mais_show", function(e){
  e.preventDefault();
  setTimeout(function() {
    $("#mais_show").hide();
    $("#mais").show();
  },250);
});

// INSERT
function devInsert() {

  var $el = $("#sync");

  // DATA TO SEND
  var data_form = $el.serialize();
  var data_auto = {
    auto_id: sessionStorage.auto_id
  };
  var data_user = {
    cli_id: localStorage.cli_id,
    cli_email: localStorage.cli_email,
    cli_pass: localStorage.cli_pass
  };
  var data_user = $.param(data_user); // serialize
  var data_auto = $.param(data_auto);
  var data = data_form + "&" + data_user + "&" + data_auto;
  console.log(data);

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/dev_insert.php",
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
        app.router.navigate("/home/");
      }

    } // res not null
  }); // after ajax
}
