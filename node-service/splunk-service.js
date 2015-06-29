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

service.login(function(err, success) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Login was successful: " + success);
  service.jobs().fetch(function(err, jobs) {
    var list = jobs.list();
    for (var i = 0; i < list.length; i++) {
      console.log("Job " + i + ": " + list[i].sid);
    }
  });
});

