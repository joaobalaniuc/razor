$$(document).on('page:init', '.page[data-name="sync"]', function (e) {

  // AUTO_ID?
  if (typeof sessionStorage.auto_id === "undefined") {
    app.dialog.alert('Desculpe, ocorreu um erro interno.');
  }
  // AUTO_NAME
  $(".auto_name").html(sessionStorage.auto_name);
  autoListSession(true);
});

// SUBMIT FORM
$$(document).on("click", '[data-name="sync"] submit', "form", function(e){
  e.preventDefault();
  //devInsert();
});

// MAIS OPÇÕES
$$(document).on("click", '[data-name="sync"] #mais_show', function(e){
  e.preventDefault();
  setTimeout(function() {
    $("#mais_show").hide();
    $("#mais").show();
  },250);
});

$$(document).on("click", '#autoDelete', function(e){
  e.preventDefault();
  app.dialog.confirm('Tem certeza que deseja remover este veículo?', 'Remover veículo', function () {
    app.dialog.confirm('Todos os dados serão perdidos.', 'Atenção!', function () {
      autoDelete();
    });
  });

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
