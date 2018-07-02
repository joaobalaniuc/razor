$$(document).on('page:init', '.page[data-name="auto"]', function (e) {
  if (typeof sessionStorage.auto_edit !== "undefined") {
    autoRead(sessionStorage.auto_edit, autoReadCbEdit);
  }
  brands();
  brands("moto");
  sessionStorage.removeItem("auto_edit");
});

function autoReadCbEdit(data) {

  Hello();
  var fn = fname();

  var res = data;
  var auto = res["auto"];
  var adm = res["adm"];

  if (auto) {

    // Dados do veiculo
    $('[name="auto_name"]').val(auto["auto_name"]);
    //$('[name="auto_name"]').val(auto["auto_name"]);

  }

  // Ainda não cadastrou um veiculo
  //else { app.router.navigate("/auto/"); }

  // Adm list
  //if (adm) { admList(adm); }
}

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
$$(document).on('change', '#carro .brands', function(e){ var id = $(this).val(); cars(id); });
$$(document).on('change', '#carro .cars', function(e){ var id = $(this).val(); years(id); });
//
$$(document).on('change', '#moto .brands', function(e){ var id = $(this).val(); cars(id, "moto"); });
$$(document).on('change', '#moto .cars', function(e){ var id = $(this).val(); years(id, "moto"); });

// BRANDS
function brands(tipo) {

  var fn = Hello(tipo);

  if (typeof tipo === "undefined") { var tipo = "carro"; }
  var $el = $("#"+tipo+" .brands");

  // RUN AJAX
  $.ajax({
    url: "http://fipeapi.appspot.com/api/1/"+tipo+"s/marcas.json",
    complete: function() {} // não apagar preloader
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

// INSERT
function autoInsert($el) {

  var fn = Hello();

  // DATA TO SEND
  var data_form = $el.serialize();
  var data_auto = {
    auto_brand: $el.find(".brands option:selected").text(),
    auto_model: $el.find(".cars option:selected").text(),
    auto_year: $el.find(".years option:selected").text(),
  };
  var data_user = ajaxUserData();
  var data_user = $.param(data_user); // serialize
  var data_auto = $.param(data_auto);
  var data = data_form + "&" + data_user + "&" + data_auto;
  console.log(fn+" --> sending data: "+data);

  app.preloader.show("green");

  // RUN AJAX
  $.ajax({
    url: localStorage.server + "/auto_insert.php",
    data: data,
  })
  .done(function (res) {
    ajaxLog(fn, res);
    if (!ajaxError(res)) {
      if (res.success) {
        sessionStorage.auto_id = res.id;
        sessionStorage.auto_name = $el.find("[name=auto_name]").val().toUpperCase();
        app.router.navigate("/sync/");
      }
    }
  }); // after ajax
}
