$(document).ready(function () {
   $('.burger').click(function (event) {
      $('.burger,.nav__list').toggleClass('active');
      $('body').toggleClass('lock');
   });
});