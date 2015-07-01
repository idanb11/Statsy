/**
 * Module dependencies.
 */

var express = require('express'),
  app = module.exports = express(),
  splunkService = require('./node-service/splunk-service');

// create an error with .status. we can then use the property in our
// custom error handler (Connect respects this prop as well)

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// here we validate the API key, by mounting this middleware to /api
// meaning only paths prefixed with "/api" will cause this middleware to be invoked

app.use('/api', function(req, res, next) {
  var key = req.query['api-key'];

  /*// key isn't present
  if (!key) return next(error(400, 'api key required'));

  // key is invalid
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));*/

  // all good, store req.key for route access
  req.key = key;
  next();
});

// we now can assume the api key is valid,
// and simply expose the data
app.get('/api/search', function(req, res, next) {
  splunkService.runSearch("search * | head 3", error, function(data) {
    res.send(data);
  });
});

app.get('/api/user/:name/repos', function(req, res, next) {
  var name = req.params.name;
  var user = userRepos[name];

  if (user) res.send(user);
  else next();
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next) {
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({error: err.message});
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res) {
  res.status(404);
  res.send({error: "Lame, can't find that"});
});

if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}
