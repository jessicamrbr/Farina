var Col_aux_templates_inputs = require("./../models/col_aux_templates_inputs");
var auxFn = require('./auxFn');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  doTemplateInputsCreate: function (req, res) {
    var col_aux_templates_inputs = new Col_aux_templates_inputs(req.body);
    col_aux_templates_inputs
      .save()
      .then(function (resultTemplateInputsCreated) {
        if(!resultTemplateInputsCreated){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível registrar o modelo de campo, confira os dados fornecidos e tente novamente"
            });
        }
        return res.status(200).json({_id: resultTemplateInputsCreated._id});
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },
  doTemplateInputsUpdate: function (req, res) {
    Col_aux_templates_inputs.findOneAndUpdate(
      {
        "_id": ObjectId(req.body._id),
        "fld_profissionalId": ObjectId(req.app.locals.credentialsToken._id)
      },
      {
        $set: {fld_template: req.body.fld_template}
      }
    )
      .exec()
      .then(function (resultTemplateInputsUpdated) {
        if(!resultTemplateInputsUpdated){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível alterar o modelo de campo, confira os dados fornecidos e tente novamente"
            });
        }
        res.status(200).json({_id: resultTemplateInputsUpdated._id});
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },
  doTemplateInputsDelete: function (req, res) {
    Col_aux_templates_inputs.findOneAndRemove(
      {
        "_id": ObjectId(req.body._id),
        "fld_profissionalId": ObjectId(req.app.locals.credentialsToken._id)
      }
    )
      .exec()
      .then(function (resultTemplateInputsDeleted) {
        if(!resultTemplateInputsDeleted){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível apagar o modelo de campo, confira os dados fornecidos e tente novamente"
            });
        }
        res.status(200).json({_id: resultTemplateInputsDeleted._id});
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

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
  doTemplateInputsList: function (req, res) {
    Col_aux_templates_inputs.find({fld_profissionalId: ObjectId(req.body._id)})
      .limit( 50 ).sort( { fld_nome: 1 } )
      .exec()
      .then(function (resultTemplateInputsList) {
        if(!resultTemplateInputsList){
          return res.status(400)
            .json({name:"Dados incorretos", message:"Modelos de campos não encontrados"});
        }
        return res.status(200).json(resultTemplateInputsList);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  }
};
