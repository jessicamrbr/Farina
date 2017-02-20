var jwt = require("jsonwebtoken");

module.exports = {
  fnEnsureAuthorized: function (userTypeNeeded) {
    return function (req, res, next) {
      if (typeof req.headers["authorization"] !== 'undefined') {
          var token = req.headers["authorization"].split(" ")[1];
          jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, tokenDecoded) {
            if (err) {res.sendStatus(401);} else {
              let checkPermission = userTypeNeeded.findIndex(function (value) {
                return value == tokenDecoded.fld_tipo;
              })
              if (checkPermission != -1) {
                req.app.locals.credentialsToken = {
                  _id: tokenDecoded._id,
                  fld_nome: tokenDecoded.fld_nome,
                  fld_tipo: tokenDecoded.fld_tipo,
                  fld_especialidadeEm: tokenDecoded.fld_especialidadeEm
                }
                req.body.tokenDecoded; next();
              }else{
                res.sendStatus(403);
              }
            }
          });
      } else {res.sendStatus(403);}
    }
  }
};
