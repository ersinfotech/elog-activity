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

      var time = process.hrtime();
      var originalEnd = res.end;
      
      // in end function, req.baseUrl will be reset, so cache in here
      var reqBaseUrl = req.baseUrl;

      res.end = function elogEnd (body, encoding) {

        var args = arguments;

        request
        .post(baseUrl + '/activities')
        .send({
          type: type,
          user_id: req.session.userId,
          group_id: req.session.groupId,
          product_id: req.session.productId,
          time_used: (function () {
            var diff = process.hrtime(time);
            return (diff[0] * 1e9 + diff[1]) / 1e9;
          })(),
          request: {
            host: req.hostname,
            method: req.method,
            path: reqBaseUrl + req.route.path,
            params: req.params,
            query: req.query,
            body: req.body
          },
          response: {
            status: res.statusCode,
            data: (function () {
              if (res.statusCode < 400) {
                return;
              }
              return body.toString();
            })()
          }
        })
        .end(function agentHandler (err, response) {
          var error;
          if (error = err || response.error) {
            console.error(error);
          };
        });

        originalEnd.apply(res, arguments);
      };

      next();
    }
  }
}