//
// ers elog middleware
//

var request = require('superagent');

module.exports = function Elog (options) {
  options = options || {};
  var baseUrl = options.baseUrl;

  if (! baseUrl) {
    console.info('baseUrl required in elog middleware');
  };

  return function elog (type) {
    return function elogHandler (req, res, next) {

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