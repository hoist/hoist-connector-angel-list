/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/search?query=joshua&type=User')
  .then(function (searchResults) {
    var promises = [];
    for(var index = 0; index < searchResults.length; index++) {
      promises.push(Hoist.event.raise('searchResult:found', searchResults[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};