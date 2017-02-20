var Col_aux_generos = require("./../models/col_aux_generos");
var auxFn = require('./auxFn');
var removeDiacritics = require('diacritics').remove;

module.exports = {
  create: function (req, res) {  },
  create: function (req, res) {  },
  create: function (req, res) {  },
  create: function (req, res) {  },

/**
 * @swagger
 * /col_aux_generos/list:
 *   post:
 *     summary: Retorna uma lista de gêneros.
 *     description: |
 *       Através de todos os parametro de busca genérica em documentos de gêneros usados porusuários, retorna uma
 *       lista com todos os gêneros condizentes.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com um termo de busca, para localização nas propriedades e-mail, número do CPF,
 *           número do cartão SUS, nome, nome legal ou/e nome da mãe de usuários.
 *         required: true
 *         schema:
 *           properties:
 *             queryString:
 *               type: string
 *           required:
 *             - queryString
 *     tags:
 *       - Helpers
 *       - Genders
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
 *               fld_genero:
 *                 type: string
 *               fld_marcadorDeGenero:
 *                 type: string
 *               fld_pronome:
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
  doGeneroList: function (req, res) {
    arrWords = removeDiacritics(req.body.queryString).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').split(" ");
    arrWords = arrWords.map( function( n ) {
        return ["(?=.*"+n+")"];
    });
    sRegex = new RegExp("^"+arrWords.join("")+".*$","im");

    Col_aux_generos.find({
      $or:[
        {fld_genero: sRegex },
        {fld_marcadorDeGenero: sRegex },
        {fld_pronome: sRegex }
      ]
    }).limit( 50 ).sort( { fld_genero: 1 } )
      .exec()
      .then(function (resultGeneroList) {
        if(!resultGeneroList){
          return res.status(400)
            .json({name:"Dados incorretos", message:"Diagnóstico não encontrado"});
        }
        return res.status(200).json(resultGeneroList);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  }
};
