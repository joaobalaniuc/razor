$$(document).on('page:init', '.page[data-name="sync"]', function (e) {

  // AUTO_ID?
  if (typeof sessionStorage.auto_id === "undefined") {
    app.dialog.alert('Desculpe, ocorreu um erro interno.');
  }
  // AUTO_NAME
  $(".auto_name").html(sessionStorage.auto_name);
});

// SUBMIT FORM
$$(document).on("submit", '#syncForm', function(e){
  e.preventDefault();
  syncPlay(true);
});

// CONCLUIR
$$(document).on('click', '#syncDone', function (e) {
  sessionStorage.clear();
  window.location.href='index.html';
});

// TENTAR novamente
$$(document).on('click', '#syncHide', function (e) {
  $("#syncArea").fadeOut("slow");
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
