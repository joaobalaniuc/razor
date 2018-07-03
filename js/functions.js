//----------------------------------------------
// GET FUNCTION NAME
//----------------------------------------------
function Hello(data) {
  var fname = Hello.caller.name;
  if (typeof data === "undefined") { data = ""; }
  console.log(fname+"("+data+")");
  return fname;
}
function fname() { return fname.caller.name; }

//----------------------------------------------
// SERIALIZE FORM TO ARRAY
//----------------------------------------------
function serial(el) {
  var paramObj = {};
  $.each($(el).serializeArray(), function(_, kv) {
    paramObj[kv.name] = kv.value;
  });
  return paramObj;
}

//----------------------------------------------
// CHECK IF FILE EXISTS
//----------------------------------------------
function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();

  if (xhr.status == "404") {
    return false;
  } else {
    return true;
  }
}

//----------------------------------------------
// JQUERY MASK INPUT / VALIDATION
//----------------------------------------------
function txtPhone() {
  $(".cel").text(function(i, text) {
    text = text.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    return text;
  });
}
function initForm() {
  var fn = Hello();
  $('.date').mask('00/00/0000');
  $('.time').mask('00:00:00');
  $('.date_time').mask('00/00/0000 00:00:00');
  $('.cep').mask('00000-000');
  $('.phone').mask('0000-0000');
  $('.phone_with_ddd').mask('(00) 00000-0000');
  $('.phone_us').mask('(000) 000-0000');
  $('.mixed').mask('AAA 000-S0S');
  $('.cpf').mask('000.000.000-00', {reverse: true});
  $('.cnpj').mask('00.000.000/0000-00', {reverse: true});
  $('.money').mask('000.000.000.000.000,00', {reverse: true});
  $('.money2').mask("#.##0,00", {reverse: true});
  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
    translation: {
      'Z': {
        pattern: /[0-9]/, optional: true
      }
    }
  });
  $('.ip_address').mask('099.099.099.099');
  $('.percent').mask('##0,00%', {reverse: true});
  $('.clear-if-not-match').mask("00/00/0000", {clearIfNotMatch: true});
  $('.placeholder').mask("00/00/0000", {placeholder: "__/__/____"});
  $('.fallback').mask("00r00r0000", {
    translation: {
      'r': {
        pattern: /[\/]/,
        fallback: '/'
      },
      placeholder: "__/__/____"
    }
  });
  $('.selectonfocus').mask("00/00/0000", {selectOnFocus: true});
}
