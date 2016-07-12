$(document).ready(function() {
  console.log('JS linked');

  

  function init() {
    console.log('file initialized');
  }

  function main() {
    console.log('main section linked');
    init();
  }


  main();

});
