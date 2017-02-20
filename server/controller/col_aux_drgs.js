var Col_aux_drgs = require("./../models/col_aux_drgs");
var auxFn = require('./auxFn');
var removeDiacritics = require('diacritics').remove;

module.exports = {
  create: function (req, res) {  },
  update: function (req, res) {  },
  finds: function (req, res) {  },

  /**
 * @swagger
 * /col_aux_drgs/list:
 *   post:
 *     summary: Retorna uma lista de DRGs.
 *     description: |
 *       Através de todos os parametro de busca genérica em documentos de DRGs, retorma uma
 *       lista com todos os DRGs condizentes.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com um termo de busca, para localização nas propriedades nome de DRGs.
 *         required: true
 *         schema:
 *           properties:
 *             queryString:
 *               type: string
 *           required:
 *             - queryString
 *     tags:
 *       - Helpers
 *       - DRG
 *       - List
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               fld_nome:
 *                 type: string
 *       400:
 *         description: Requisição falhou. Uma mensagem é retornada com mais informações.
 *         schema:
 *           $ref: '#/definitions/Error'
 *       401:
 *         description: Verificação de token falhou, acesso não autorizado.
 *         schema:
 *           $ref: '#/definitions/Error'
 *       403:
 *         description: Página não existe ou o acesso não esta autorizado.
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: Erro inesperado. Uma mensagem é retornada com mais informações.
 *         schema:
 *           $ref: '#/definitions/Error'
 */
  doDrgList: function (req, res) {
    arrWords = removeDiacritics(req.body.queryString).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').split(" ");
    arrWords = arrWords.map( function( n ) {
        return ["(?=.*"+n+")"];
    });
    sRegex = new RegExp("^"+arrWords.join("")+".*$","im");

    Col_aux_drgs.find({
      $or:[
        {fld_nome: sRegex }
      ]
    }).limit( 50 ).sort( { fld_nome: 1 } )
      .exec()
      .then(function (resultDrgList) {
        if(!resultDrgList){
          return res.status(400)
            .json({name:"Dados incorretos", message:"DRG não encontrado"});
        }
        return res.status(200).json(resultDrgList);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  }
};
