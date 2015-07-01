/**
 * Created by Idanb11 on 29-Jun-15.
 */
var splunkjs = require('splunk-sdk');

// Create a Service instance and log in
var service = new splunkjs.Service({
  username: "idan",
  password: "changeme",
  scheme  : "https",
  host    : "splunk.maptiv8.com",
  port    : "8089",
  version : "default"
});

exports.runSearch = function(queryString, errorFn, returnData) {
  splunkjs.Async.chain([

      function(done) { // First, we log in
        service.login(done);
      },
      function(success, done) { // Perform the search
        if (!success) {
          done("Error logging in");
        }

        service.oneshotSearch(queryString, {}, done);
      },
      // The job is done, and the results are returned
      function(results, done) {
        done(null, results);
      }
    ],
    function(err, results) {
      if (err) {
        errorFn('500', err);
        return;
      }

      console.log("DONE");
      returnData(results.rows);
    }
  );
};



