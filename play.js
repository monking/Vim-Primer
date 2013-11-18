var i, thing;

thing = (function() {

  var foo, bar;

  foo = function() {
    if(typeof bar === "undefined") {
      bar = 0;
    } else {
      bar++;
    }
    console && console.log(bar);
  };

  return {
    foo:foo,
    bar:bar
  };

})();

for(i = 0; i < 5; i++) {
  thing.foo();
}
