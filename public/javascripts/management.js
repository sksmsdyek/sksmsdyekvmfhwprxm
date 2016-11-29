$('#myTab a').click(function (e) {
  e.preventDefault()
  $('#myTab a[href="#list"]').tab('show')
  $('#myTab a[href="#reservation"]').tab('show')
  $(this).tab('show')
});