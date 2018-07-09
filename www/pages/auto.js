$$(document).on('page:init', '.page[data-name="auto"]', function (e) {
  if (typeof sessionStorage.auto_edit !== "undefined") {
    alert(1);
    autoRead(sessionStorage.auto_edit, autoReadCbEdit);
    $("#carro, #moto").prepend("<input type='hidden' name='auto_id' value='"+sessionStorage.auto_edit+"' />");
    $('[data-name="auto"] [type=submit]').html("Salvar alterações");
    $('[data-name="auto"] .title').html("Editar veículo");
  }
  brands();
  brands("moto");
  sessionStorage.removeItem("auto_edit");
});

// SUBMIT FORM
$$(document).on("submit", '[data-name="auto"] form', function(e){
  e.preventDefault();
  autoInsert($(this));
});

// BUTTON EDIT
$$(document).on('click', '.auto_edit', function () {
  var id = $(this).attr("data-id");
  sessionStorage.auto_edit = id;
  app.router.navigate("/auto/");
});

// CHANGE
$$(document).on('change', '#carro .brands', function(e){
  var id = $(this).val();
  $("#carro .cars").html("");
  $("#carro .years").html("");
  cars(id);
});
$$(document).on('change', '#carro .cars', function(e){ var id = $(this).val(); years(id); });
//
$$(document).on('change', '#moto .brands', function(e){
  var id = $(this).val();
  $("#moto .cars").html("");
  $("#moto .years").html("");
  cars(id, "moto");
});
$$(document).on('change', '#moto .cars', function(e){ var id = $(this).val(); years(id, "moto"); });

// BRANDS
function brands(tipo) {

  var fn = Hello(tipo);

  if (typeof tipo === "undefined") { var tipo = "carro"; }
  var $el = $("#"+tipo+" .brands");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/marcas.json",
    complete: function() {}, // não apagar preloader
    beforeSend: function() {} // não mostrar preloader
  })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>"); });
  }); // after ajax
}

// MODELS
function cars(id, tipo) {

  var fn = Hello(id);

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .cars");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") {
    console.log(fn+" *** brand id not found");
    return false;
  }
  app.preloader.show("green");

  // RUN AJAX
  $.ajax({ url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculos/"+id+".json", })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.fipe_name+"</option>"); });
  }); // after ajax
}

// ANO/COMBUSTIVEL
function years(id, tipo) {

  var fn = Hello(id);

  if (typeof tipo === "undefined") { tipo = "carro"; }
  var $el = $("#"+tipo+" .years");

  $el.html("<option value=''>-</option>");

  if (typeof id === "undefined") {
    console.log(fn+" *** car id not found");
    return false;
  }
  var brand_id = $("#"+tipo+" .brands").val();

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({ url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/veiculo/"+brand_id+"/"+id+".json", })
  .done(function (res) {
    ajaxLog(fn, res);
    $.each(res, function(key, val) { $el.append("<option value='"+val.id+"'>"+val.name+"</option>"); });
  }); // after ajax
}
