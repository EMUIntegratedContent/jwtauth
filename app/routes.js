var User   = require('./models/user'); // get our mongoose model

module.exports = function(app, router){

  // basic route
  router.get('/', function(req, res) {
      res.send('Hello! The API is at http://localhost:8080/api');
  });

  router.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
      name: 'Nick Cerminara', 
      password: 'password',
      admin: true
    });

    // save the sample user
    nick.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      res.json({ success: true });
    });
  });

  return router
}
