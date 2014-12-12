/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angel = Hoist.connector('<key>');
  angel.get('/products', function(products) {
    for(var index = 0; index < products.length; index++) {
      Hoist.event.raise('job:found', products[index]);
    }
  });

};