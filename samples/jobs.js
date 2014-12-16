/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var angelList = Hoist.connector('<key>');
  angelList.get('/jobs')
  .then(function (jobs) {
    var promises = [];
    for(var index = 0; index < jobs.length; index++) {
      promises.push(Hoist.event.raise('job:found', jobs[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};