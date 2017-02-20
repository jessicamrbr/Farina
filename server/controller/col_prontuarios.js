var Col_prontuarios = require("./../models/col_prontuarios");
var auxFn = require('./auxFn');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
/**
 * @swagger
 * /col_prontuarios/create:
 *   post:
 *     summary: Cadastra um DRG.
 *     description: |
 *       Insere um DRG para o prontuário de um usuário selecionado.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com os dados de um novo motivo de atendimento e usuário.
 *         required: true
 *         schema:
 *           properties:
 *             fld_usuarioId:
 *               type: string
 *             fld_usuarioName:
 *               type: string
 *             fld_drgId:
 *               type: string
 *             fld_drgName:
 *               type: string
 *             fld_data:
 *               type: string
 *             arr_consultas:
 *               type: array
 *               items: object
 *           required:
 *             - fld_usuarioId
 *             - fld_usuarioName
 *             - fld_drgId
 *             - fld_drgName
 *     tags:
 *       - EMR
 *       - Create
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doEmrCreate: function (req, res) {
    var col_prontuarios = new Col_prontuarios(req.body);
    col_prontuarios
      .save()
      .then(function (resultEmrCreated) {
        if(!resultEmrCreated){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível registrar o DRG para o usuário, confira os dados fornecidos e tente novamente"
            });
        }
        return res.status(200).json({_id: resultEmrCreated._id});
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/create/appointment:
 *   post:
 *     summary: Cadastra uma consulta.
 *     description: |
 *       Insere uma consulta a um DRG selecionado de prontuário de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do DRG (_idEmr) e os dados de uma nova
 *           consulta.
 *         required: true
 *         schema:
 *           properties:
 *             _idEmr:
 *               type: string
 *             fld_data:
 *               type: date
 *             fld_especialidade:
 *               type: string
 *             fld_profissionalId:
 *               type: string
 *             fld_profissionalName:
 *               type: string
 *             fld_queixa:
 *               type: string
 *             fld_anamnese:
 *               type: string
 *             fld_conduta:
 *               type: string
 *             fld_observacao:
 *               type: string
 *             fld_diagnostico:
 *               type: string
 *             fld_retornoRecomendacoes:
 *               type: string
 *             fld_interrogatoriosMedidas:
 *               type: string
 *             fld_avaliacaoExamesAnteriores:
 *               type: string
 *             fld_anotacoesPrivadas:
 *               type: array
 *               items: object
 *             fld_prescricoes:
 *               type: array
 *               items: object
 *           required:
 *             - _idEmr
 *             - fld_especialidade
 *             - fld_profissionalId
 *             - fld_profissionalName
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Create
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doAppointmentCreate: function (req, res) {
    var tempEmrId = req.body._idEmr;
    delete req.body._idEmr;

    Col_prontuarios.findById(tempEmrId)
      .exec()
      .then(function (resultEmr) {
        if(!resultEmr){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível adicionar a consulta ao DRG, confira os dados fornecidos e tente novamente"
            });
        }

        resultEmr.arr_consultas.push(req.body);
        var appointmentId = resultEmr.arr_consultas[resultEmr.arr_consultas.length-1]._id;

        resultEmr = new Col_prontuarios(resultEmr);
        resultEmr.save()
          .then(function (resultAppointment) {
            if(!resultAppointment){
              return res.status(400)
                .json({
                  name:"Dados incorretos",
                  message:"Não foi possível adicionar a consulta ao DRG, confira os dados fornecidos e tente novamente"
                });
            }
            res.status(200).json({_id: appointmentId});
          })
          .catch(function (err) {
            return res.status(500).json(auxFn.fnErrorClean(err));
          });
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/create/privateNotes:
 *   post:
 *     summary: Cadastra uma anotação privada.
 *     description: |
 *       Insere uma anotação privada a uma consulta a um DRG selecionado de prontuário de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do DRG (_idEmr), o código de indentificação
 *           de uma consulta (_idAppointment) e os dados de uma nova anotação privada.
 *         required: true
 *         schema:
 *           properties:
 *             _idEmr:
 *               type: string
 *             _idAppointment:
 *               type: string
 *             fld_data:
 *               type: date
 *             fld_profissionalId:
 *               type: string
 *             fld_descricao:
 *               type: string
 *           required:
 *             - _idEmr
 *             - _idAppointment
 *             - fld_profissionalId
 *             - fld_descricao
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Private Notes
 *       - Create
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doPrivateNotesCreate: function (req, res) {
    var tempEmrId = req.body._idEmr;
    var tempAppointmentId = req.body._idAppointment;
    delete req.body._idEmr;
    delete req.body._idAppointment;

    Col_prontuarios.findOne({
      "_id": tempEmrId,
      "arr_consultas._id": tempAppointmentId
    })
      .exec()
      .then(function (resultEmr) {
        if(!resultEmr){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível adicionar a anotações privadas a consulta, confira os dados fornecidos e tente novamente"
            });
        }

        resultEmr.arr_consultas.id(tempAppointmentId).fld_anotacoesPrivadas.push(req.body);
        var privateNotesId =
            resultEmr.arr_consultas.id(tempAppointmentId).fld_anotacoesPrivadas[
              resultEmr.arr_consultas.id(tempAppointmentId).fld_anotacoesPrivadas.length-1
            ]._id;

        resultEmr = new Col_prontuarios(resultEmr);
        resultEmr.save()
          .then(function (resultPrivateNotes) {
            if(!resultPrivateNotes){
              return res.status(400)
                .json({
                  name:"Dados incorretos",
                  message:"Não foi possível adicionar a anotações privadas a consulta, confira os dados fornecidos e tente novamente"
                });
            }
            res.status(200).json({_id: privateNotesId});
          })
          .catch(function (err) {
            return res.status(500).json(auxFn.fnErrorClean(err));
          });
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/create/prescription:
 *   post:
 *     summary: Cadastra uma prescrição.
 *     description: |
 *       Insere uma prescrição a uma consulta a um DRG selecionado de prontuário de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do DRG (_idEmr), o código de indentificação
 *           de uma consulta (_idAppointment) e os dados de uma nova prescrição.
 *         required: true
 *         schema:
 *           properties:
 *             _idEmr:
 *               type: string
 *             _idAppointment:
 *               type: string
 *             fld_data:
 *               type: date
 *             fld_profissionalId:
 *               type: string
 *             fld_descricao:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fld_ordem:
 *                     type: string
 *                   fld_item:
 *                     type: string
 *                   fld_DescricaoItem:
 *                     type: string
 *           required:
 *             - _idEmr
 *             - _idAppointment
 *             - fld_profissionalId
 *             - fld_descricao
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Prescription
 *       - Create
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doPrescriptionCreate: function (req, res) {
    var tempEmrId = req.body._idEmr;
    var tempAppointmentId = req.body._idAppointment;
    delete req.body._idEmr;
    delete req.body._idAppointment;

    Col_prontuarios.findOne({
      "_id": tempEmrId,
      "arr_consultas._id": tempAppointmentId
    })
      .exec()
      .then(function (resultEmr) {
        if(!resultEmr){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível adicionar a prescrições a consulta, confira os dados fornecidos e tente novamente"
            });
        }

        resultEmr.arr_consultas.id(tempAppointmentId).fld_prescricoes.push(req.body);
        var prescriptionId =
            resultEmr.arr_consultas.id(tempAppointmentId).fld_prescricoes[
              resultEmr.arr_consultas.id(tempAppointmentId).fld_prescricoes.length-1
            ]._id;

        resultEmr = new Col_prontuarios(resultEmr);
        resultEmr.save()
          .then(function (resultPrescriptionId) {
            if(!resultPrescriptionId){
              return res.status(400)
                .json({
                  name:"Dados incorretos",
                  message:"Não foi possível adicionar a prescrições a consulta, confira os dados fornecidos e tente novamente"
                });
            }
            res.status(200).json({_id: prescriptionId});
          })
          .catch(function (err) {
            console.log(err.errors.arr_consultas.errors);
            return res.status(500).json(auxFn.fnErrorClean(err));
          });
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/list:
 *   post:
 *     summary: Lista Prontuários.
 *     description: |
 *       Retorna uma lista com todos os prontuários, consultas e prescrições de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do usuário.
 *         required: true
 *         schema:
 *           properties:
 *             _id:
 *               type: string
 *           required:
 *             - _id
 *     tags:
 *       - EMR
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
 *               fld_usuarioId:
 *                 type: string
 *               fld_usuarioName:
 *                 type: string
 *               fld_drgId:
 *                 type: string
 *               fld_drgName:
 *                 type: string
 *               fld_data:
 *                 type: string
 *               arr_consultas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fld_data:
 *                       type: date
 *                     fld_especialidade:
 *                       type: string
 *                     fld_profissionalId:
 *                       type: string
 *                     fld_profissionalName:
 *                       type: string
 *                     fld_queixa:
 *                       type: string
 *                     fld_anamnese:
 *                       type: string
 *                     fld_conduta:
 *                       type: string
 *                     fld_observacao:
 *                       type: string
 *                     fld_diagnostico:
 *                       type: string
 *                     fld_retornoRecomendacoes:
 *                       type: string
 *                     fld_interrogatoriosMedidas:
 *                       type: string
 *                     fld_avaliacaoExamesAnteriores:
 *                       type: string
 *                     fld_prescricoes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fld_data:
 *                             type: date
 *                           fld_profissionalId:
 *                             type: string
 *                           fld_descricao:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 fld_ordem:
 *                                   type: string
 *                                 fld_item:
 *                                   type: string
 *                                 fld_DescricaoItem:
 *                                   type: string
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
  doEmrList: function (req, res) {
    Col_prontuarios.find({
      fld_usuarioId: req.body._id
    },{
      "arr_consultas.fld_anotacoesPrivadas": 0
    })
      .exec()
      .then(function (resultUserEmrs) {
        if(!resultUserEmrs){
          return res.status(400)
            .json({
              name:"Solicitação inválida",
              message:"Usuário sem motivos de atendimento"
            });
        }
        return res.status(200).json(resultUserEmrs);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/list/privateNotes:
 *   post:
 *     summary: Lista notas privadas.
 *     description: |
 *       Retorna uma lista com notas de privadas de cada consulta, em função do código indentificador
 *       de um usuário e código identificador do profissional logado.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do usuário (_id).
 *         required: true
 *         schema:
 *           properties:
 *             _id:
 *               type: string
 *           required:
 *             - _id
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Private Notes
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
 *               arr_consultas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fld_anotacoesPrivadas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fld_data:
 *                             type: date
 *                           fld_profissionalId:
 *                             type: string
 *                           fld_descricao:
 *                             type: string
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
  doPrivateNotesList: function (req, res) {
    console.log(req.app.locals.credentialsToken._id);
    Col_prontuarios.aggregate(
      {$match: { "fld_usuarioId": ObjectId(req.app.locals.credentialsToken._id) }},
        {$unwind: "$arr_consultas"},
          {$unwind: "$arr_consultas.fld_anotacoesPrivadas"},
            {$match: { "arr_consultas.fld_anotacoesPrivadas.fld_profissionalId": ObjectId(req.app.locals.credentialsToken._id) }},
              {$project: {
                "_id":1,
                "arr_consultas._id":1,
                "arr_consultas.fld_anotacoesPrivadas":1
              }}
    )
      .exec()
      .then(function (resultPrivateNotes) {
        if(!resultPrivateNotes){
          return res.status(400)
            .json({
              name:"Solicitação inválida",
              message:"Nenhuma anotação privada foi encontrada para este usuário"
            });
        }

        for (var i in resultPrivateNotes) {
          resultPrivateNotes[i].arr_consultas.fld_anotacoesPrivadas =
            [resultPrivateNotes[i].arr_consultas.fld_anotacoesPrivadas];
          resultPrivateNotes[i].arr_consultas = [resultPrivateNotes[i].arr_consultas];
        }

        return res.status(200).json(resultPrivateNotes);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
    },

/**
 * @swagger
 * /col_prontuarios/update/appointment:
 *   post:
 *     summary: Altera uma consulta.
 *     description: |
 *       Altera as informações de uma consulta selecionado do prontuário de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do DRG (_idEmr), o código de indentificação
 *           de uma consulta (_idAppointment) e os dados atualizados da consulta.
 *         required: true
 *         schema:
 *           properties:
 *             _idEmr:
 *               type: string
 *             _idAppointment:
 *               type: string
 *             fld_data:
 *               type: date
 *             fld_especialidade:
 *               type: string
 *             fld_profissionalId:
 *               type: string
 *             fld_profissionalName:
 *               type: string
 *             fld_queixa:
 *               type: string
 *             fld_anamnese:
 *               type: string
 *             fld_conduta:
 *               type: string
 *             fld_observacao:
 *               type: string
 *             fld_diagnostico:
 *               type: string
 *             fld_retornoRecomendacoes:
 *               type: string
 *             fld_interrogatoriosMedidas:
 *               type: string
 *             fld_avaliacaoExamesAnteriores:
 *               type: string
 *           required:
 *             - _idEmr
 *             - _idAppointment
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Update
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doAppointmentUpdate: function (req, res) {
    var tempEmrId = req.body._idEmr;
    var tempAppointmentId = req.body._idAppointment;
    delete req.body._idEmr;
    delete req.body._idAppointment;

    var newReqBody = {}
    for (const key of Object.keys(req.body)) {
      newReqBody["arr_consultas.$." + key] = req.body[key];
    }

    Col_prontuarios.findOneAndUpdate(
      {
        "_id": tempEmrId,
        "arr_consultas._id": tempAppointmentId
      },
      {
        $set: newReqBody
      }
    )
      .exec()
      .then(function (resultEmrUpdated) {
        if(!resultEmrUpdated){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível alterar a consulta, confira os dados fornecidos e tente novamente"
            });
        }
        res.status(200).json({_id: tempAppointmentId});
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_prontuarios/update/privateNotes:
 *   post:
 *     summary: Altera uma anotação privada.
 *     description: |
 *       Altera as informações de uma anotação privada no prontuário de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com o código de indentificação do DRG (_idEmr), o código de indentificação
 *           de uma consulta (_idAppointment), o codigo de identificação de uma anotação privada e
 *           os dados atualizados da consulta.
 *         required: true
 *         schema:
 *           properties:
 *             _idEmr:
 *               type: string
 *             _idAppointment:
 *               type: string
 *             _idPrivateNote:
 *               type: string
 *             fld_data:
 *               type: date
 *             fld_profissionalId:
 *               type: string
 *             fld_descricao:
 *               type: string
 *           required:
 *             - _idEmr
 *             - _idAppointment
 *             - _idPrivateNote
 *     tags:
 *       - EMR
 *       - Appointment
 *       - Update
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Id'
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
  doPrivateNotesUpdate: function (req, res) {
    var tempEmrId = req.body._idEmr;
    var tempAppointmentId = req.body._idAppointment;
    var tempPrivateNoteId = req.body._idPrivateNote;
    delete req.body._idEmr;
    delete req.body._idAppointment;
    delete req.body._idPrivateNote;

    Col_prontuarios.findOne(
      {
        "_id": tempEmrId,
        "arr_consultas._id": tempAppointmentId,
        "arr_consultas.fld_anotacoesPrivadas._id": tempPrivateNoteId,
        "arr_consultas.fld_anotacoesPrivadas.fld_profissionalId": req.app.locals.credentialsToken._id
      }
    )
      .exec()
      .then(function (resultPrivateNoteToUpdate) {
        if(!resultPrivateNoteToUpdate){
          return res.status(400)
            .json({
              name:"Dados incorretos",
              message:"Não foi possível alterar a anotação privada, confira os dados fornecidos e tente novamente"
            });
        }

        Object.assign(
          resultPrivateNoteToUpdate.arr_consultas.id(tempAppointmentId).fld_anotacoesPrivadas.id(tempPrivateNoteId),
          req.body
        );

        resultPrivateNoteToUpdate
          .save()
          .then(function (resultEmrCreated) {
            if(!resultEmrCreated){
              return res.status(400)
                .json({
                  name:"Dados incorretos",
                  message:"Não foi possível alterar a anotação privada, confira os dados fornecidos e tente novamente"
                });
            }
            return res.status(200).json({_id: tempPrivateNoteId});
          })
          .catch(function (err) {
            return res.status(500).json(auxFn.fnErrorClean(err));
          });
      })
      .catch(function (err) {
        console.log(err);
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  }
};
