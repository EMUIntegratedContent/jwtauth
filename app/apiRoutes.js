var User   = require('./models/user'); // get our mongoose model

module.exports = function(app, router, jwt){

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  router.post('/authenticate', function(req, res){

    // find the user
    User.findOne({
      name: req.body.name
    }, function(err, user){
      if(err)
        throw err

      if(!user){
        res.status(400).json( { success: false, message: 'Authentication failed. User not found.' } )
      } else if (user) {

        // check if password matches
        if(user.password != req.body.password){
          res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' })
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn : 60*60*24 // expires in 24 hours
          })

          // return the information including the token as JSON
          res.status(200).json({
            success: true,
            message: "Here, have a token.",
            token: token
          })
        }
      }
    })
  })

  // route middleware to verify a token
  // We dont't want to protect the /api/authenticate route so place middleware beneath that route. Order is important.
  router.use(function(req,res,next){

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token']

    // decode token if found
    if(token){
      // verify secret and check expiration time
      jwt.verify(token, app.get('superSecret'), function(err, decoded){
        if(err){
          return res.status(400).json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded
          next()
        }
      })
    } else {
      // if there is no token, return an error
      return res.status(403).send({
        success: false,
        message: 'No token provideed.'
      })
    }
  })

  // route to show a random message (GET http://localhost:8080/api/)
  router.get('/welcome', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });

  // route to return all users (GET http://localhost:8080/api/users)
  router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      res.json(users);
    });
  });

  return router
}
