/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/tags/1654')
  .then(function (tag) {
    Hoist.event.raise('tag:found', tag)
  })
  .then(done);
};