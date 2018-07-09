
// SUBMIT FORM
$$(document).on("submit", "#registerForm", function(e){
  e.preventDefault();
  if ($("#pass1").val()!=$("#pass2").val()) {
    app.dialog.alert('As senhas não coincidem.');
    return false;
  }
  userInsert(userSave);
});
