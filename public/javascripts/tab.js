$('#list a').click(function (e) {
  e.preventDefault();
  $('#list a[href="#list"]').tab('show');
});

$('#reservation a').click(function (e) {
  e.preventDefault();
   $('#reservation a[href="#reservation"]').tab('show');
});