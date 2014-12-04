//
// ers elog activity middleware
//

var request = require('superagent');

module.exports = function elogActivity (options) {
  options = options || {};
  var baseUrl = options.baseUrl;

  if (! baseUrl) {
    console.info('baseUrl required in elog-activity middleware');
  };

  return function elogActivityMiddleware (type) {
    return function elogActivityHandler (req, res, next) {

      if (! baseUrl) {
        return next();
      };

      if (! req.session) {
        req.session = {};
      };

      request
      .post(baseUrl + '/activities')
      .send({
        type: type,
        user_id: req.session.userId,
        group_id: req.session.groupId,
        product_id: req.session.productId,
        host: req.hostname,
        method: req.method,
        path: req.baseUrl + req.route.path,
        params: req.params,
        query: req.query,
        body: req.body
      })
      .end(function agentHandler (err, response) {
        var error;
        if (error = err || response.error) {
          console.error(error);
        };
      });

      next();
    }
  }
}