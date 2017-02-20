var Col_usuarios = require("./../models/col_usuarios");
var auxFn = require('./auxFn');
var jwt = require("jsonwebtoken");
var argon2 = require('argon2');
var removeDiacritics = require('diacritics').remove;

const SMTPConnection = require('smtp-connection');

function criptyPass (passString, fnCallBack) {
  argon2.generateSalt().then(salt => {
    argon2.hash(passString, salt).then(hash => {
      fnCallBack(hash);
    });
  });
}

function checkCriptyPass (passEncripty, passString, fnCallBack) {
  argon2.verify(passEncripty, passString).then(valid => {
    fnCallBack(valid);
  }).catch(() => {
    fnCallBack(false);
  });
}

module.exports = {
/**
 * @swagger
 * /col_usuarios/create:
 *   post:
 *     summary: Cadastra um usuário.
 *     description: |
 *       Atualiza os dados do perfil de um usuário selecionado.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com código de identificação do usuário a alterar, e seus novos dados.
 *         required: true
 *         schema:
 *           properties:
 *             fld_email:
 *               type: string
 *             fld_senha:
 *               type: string
 *             fld_tipo:
 *               type: string
 *               enum:
 *                 - usuario
 *                 - recepcao
 *                 - profissional
 *                 - administrador
 *             fld_cadastroPessoaFisica:
 *               type: string
 *             fld_cartaoSUS:
 *               type: string
 *             fld_nome:
 *               type: string
 *             fld_nomeLegal:
 *               type: string
 *             fld_genero:
 *               type: string
 *             fld_generoAtribuidoNascimento:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_generoLegal:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_dataNascimento:
 *               type: string
 *             fld_filiacao:
 *               type: string
 *             fld_naturalidade:
 *               type: string
 *             fld_estadoCivil:
 *               type: string
 *               enum:
 *                 - Solteiro
 *                 - Casado
 *                 - Separado
 *                 - Divorciado
 *                 - Divorciado
 *             fld_profissao:
 *               type: string
 *             fld_ocupacao:
 *               type: string
 *             fld_escolaridade:
 *               enum:
 *                 - Fundamental - Incompleto
 *                 - Fundamental - Completo
 *                 - Médio - Incompleto
 *                 - Médio - Completo
 *                 - Superior - Incompleto
 *                 - Superior - Completo
 *                 - Pós-graduação - Incompleto
 *                 - Pós-graduação - Completo
 *             fld_enderecoLogradouro:
 *               type: string
 *             fld_enderecoNumero:
 *               type: string
 *             fld_enderecoComplemento:
 *               type: string
 *             fld_enderecoBairro:
 *               type: string
 *             fld_enderecoCidade:
 *               type: string
 *               default: São Paulo
 *             fld_enderecoUF:
 *               type: string
 *               default: SP
 *             fld_enderecoPais:
 *               type: string
 *               default: Brasil
 *             fld_enderecoCEP:
 *               type: string
 *             fld_contatoCelular:
 *               type: string
 *             fld_contatoTelefone:
 *               type: string
 *           required:
 *             - fld_email
 *             - fld_cadastroPessoaFisica
 *             - fld_cartaoSUS
 *     tags:
 *       - User
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
  doUserCreate: function (req, res) {
    // Adjust name observation
    if (req.body.fld_nome !== req.body.fld_nomeLegal) {
      req.body.fld_nome = req.body.fld_nome + "*";
    }

    function fnExecPosCripty (hash) {
      req.body.fld_senha = hash;
      var col_usuarios = new Col_usuarios(req.body);
      col_usuarios
        .save()
        .then(function (resultUserCreated) {
          if(!resultUserCreated){
            return res.status(400)
              .json({
                name:"Dados incorretos",
                message:"Não foi possível criar o usuário, confira os dados fornecidos e tente novamente"
              });
          }
          return res.status(200).json({_id: resultUserCreated._id});
        })
        .catch(function (err) {
          return res.status(500).json(auxFn.fnErrorClean(err));
        });
    }
    criptyPass(req.body.fld_senha, fnExecPosCripty);
  },

/**
 * @swagger
 * /col_usuarios/list:
 *   post:
 *     summary: Retorna uma lista de usuários.
 *     description: |
 *       Através de todos os parametro de busca genérica em documentos de usuários, retorma uma
 *       lista com todos os perfis condizentes.
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
 *       - User
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
 *               fld_email:
 *                 type: string
 *               fld_tipo:
 *                 type: string
 *                 enum:
 *                   - usuario
 *                   - recepcao
 *                   - profissional
 *                   - administrador
 *               fld_cadastroPessoaFisica:
 *                 type: string
 *               fld_cartaoSUS:
 *                 type: string
 *               fld_nome:
 *                 type: string
 *               fld_nomeLegal:
 *                 type: string
 *               fld_genero:
 *                 type: string
 *               fld_generoAtribuidoNascimento:
 *                 type: string
 *                 enum:
 *                   - Feminino
 *                   - Masculino
 *               fld_generoLegal:
 *                 type: string
 *                 enum:
 *                   - Feminino
 *                   - Masculino
 *               fld_dataNascimento:
 *                 type: string
 *               fld_filiacao:
 *                 type: string
 *               fld_naturalidade:
 *                 type: string
 *               fld_estadoCivil:
 *                 type: string
 *                 enum:
 *                   - Solteiro
 *                   - Casado
 *                   - Separado
 *                   - Divorciado
 *                   - Divorciado
 *               fld_profissao:
 *                 type: string
 *               fld_ocupacao:
 *                 type: string
 *               fld_escolaridade:
 *                 type: string
 *                 enum:
 *                   - Fundamental - Incompleto
 *                   - Fundamental - Completo
 *                   - Médio - Incompleto
 *                   - Médio - Completo
 *                   - Superior - Incompleto
 *                   - Superior - Completo
 *                   - Pós-graduação - Incompleto
 *                   - Pós-graduação - Completo
 *               fld_enderecoLogradouro:
 *                 type: string
 *               fld_enderecoNumero:
 *                 type: string
 *               fld_enderecoComplemento:
 *                 type: string
 *               fld_enderecoBairro:
 *                 type: string
 *               fld_enderecoCidade:
 *                 type: string
 *                 default: São Paulo
 *               fld_enderecoUF:
 *                 type: string
 *                 default: SP
 *               fld_enderecoPais:
 *                 type: string
 *                 default: Brasil
 *               fld_enderecoCEP:
 *                 type: string
 *               fld_contatoCelular:
 *                 type: string
 *               fld_contatoTelefone:
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
  doUserList: function (req, res) {
    arrWords = removeDiacritics(req.body.queryString).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').split(" ");
    arrWords = arrWords.map( function( n ) {
        return ["(?=.*"+n+")"];
    });
    sRegex = new RegExp("^"+arrWords.join("")+".*$","im");

    Col_usuarios.find({
      $or:[
        {fld_email: sRegex },
        {fld_cadastroPessoaFisica: sRegex },
        {fld_cartaoSUS: sRegex },
        {fld_nome: sRegex },
        {fld_nomeLegal: sRegex },
        {fld_filiacao: sRegex },
        {fld_contatoCelular: sRegex },
        {fld_contatoTelefone: sRegex }
      ]
    }, {
      fld_senha: 0
    })
      .exec()
      .then(function (resultUsersList) {
        if(!resultUsersList){
          return res.status(400)
            .json({name:"Dados incorretos", message:"Usuário não encontrados"});
        }
        return res.status(200).json(resultUsersList);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_usuarios/login:
 *   post:
 *     summary: Efetua o acesso do usuário
 *     description: |
 *       Confere a combinação CPF e senha de um usuário  e caso valida retorna um token
 *       de sessão
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com CPF e senha do usuário
 *         required: true
 *         schema:
 *           properties:
 *             fld_senha:
 *               type: string
 *             fld_cadastroPessoaFisica:
 *               type: string
 *           required:
 *             - fld_cadastroPessoaFisica
 *             - fld_senha
 *     tags:
 *       - User
 *       - Login
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           properties:
 *             token:
 *               type: string
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
  doUserLogin: function (req, res) {
    var col_usuarios = Col_usuarios.findOne({
      fld_cadastroPessoaFisica: req.body.fld_cadastroPessoaFisica
    },{
      _id: 1,
      fld_senha: 1,
      fld_nome: 1,
      fld_tipo: 1,
      fld_especialidadeEm: 1
    })
      .exec()
      .then(function (resultUser) {
        if (!resultUser) {
          return res.status(400)
            .json({name:"Dados incorretos", message:"CPF não encontrados"});
        }

        function fnRetornoPosValidacao (validacao) {
          if (validacao) {
            var token = jwt.sign({
              _id: resultUser.toObject()._id,
              fld_nome: resultUser.toObject().fld_nome,
              fld_tipo: resultUser.toObject().fld_tipo,
              fld_especialidadeEm: resultUser.toObject().fld_especialidadeEm
            }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });

            return res.status(200).json({token: token});
          } else {
            return res.status(400)
              .json({name:"Dados incorretos", message:"Senha incorreta"});
          }
        }
        checkCriptyPass(resultUser.fld_senha, req.body.fld_senha, fnRetornoPosValidacao);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      })
  },

/**
 * @swagger
 * /col_usuarios/recoveryPass:
 *   post:
 *     summary: Recupera acesso
 *     description: |
 *       Seleciona um usuário pelo CPF, gera uma nova senha aleatória e envia ao e-mail principal
 *       de cadastro.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com CPF do usuário a recuperar o acesso
 *         required: true
 *         schema:
 *           properties:
 *             fld_cadastroPessoaFisica:
 *               type: string
 *           required:
 *             - fld_cadastroPessoaFisica
 *     tags:
 *       - User
 *       - RecoveryPass
 *     responses:
 *       200:
 *         description: |
 *           Recuperação de acesso efetuada com sucesso.
 *         schema:
 *           $ref: '#/definitions/Error'
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
  doRecoveryPass: function (req, res) {
    var connectionSMTP = new SMTPConnection({
      port: 25,
      host: "mail.epm.br",
      secure: false,
    });

    var newPassGerated = Math.random().toString(36).slice(-8);

    function fnExecPosCripty (hash) {
      Col_usuarios.col_usuarios.findOneAndUpdate({
        fld_cadastroPessoaFisica: req.body.fld_cadastroPessoaFisica
      }, {
        $set:{
          fld_senha: newPassGerated
        }
      })
        .exec()
        .then(function (resultUserUpdated) {
          if(!resultUserUpdated){
            return res.status(400)
              .json({name:"Dados incorretos", message:"Usuário não encontrados"});
          }

          var lblNewPassGerated = "Sua nova senha é: " + newPassGerated;

          connectionSMTP.connect(function () {
            connectionSMTP.send({
              from: "sistemas.nucleotrans@unifesp.br",
              to: resultUserUpdated.fld_email,
              subject:  "Recuperação de Senha"
            }, lblNewPassGerated, function(err, info){
              connectionSMTP.close();
              if (info) {
                return res.status(200)
                  .json({name:"Sucesso", message:"Senha alterada e enviada ao e-mail cadastrado"});
              }
              if (err) {
                return res.status(500).json(auxFn.fnErrorClean(err));
              }
            });
          });

        })
        .catch(function (err) {
          return res.status(500).json(auxFn.fnErrorClean(err));
        });
    }
    criptyPass(newPassGerated, fnExecPosCripty);

  },

/**
 * @swagger
 * /col_usuarios/select:
 *   post:
 *     summary: Seleciona usuário.
 *     description: |
 *       Seleciona dados de perfil de um usuário.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com código de identificação do usuário a selecionar.
 *         required: true
 *         schema:
 *           properties:
 *             _id:
 *               type: string
 *           required:
 *             - _id
 *     tags:
 *       - User
 *       - Select
 *     responses:
 *       200:
 *         description: Requisição efetuada com sucesso.
 *         schema:
 *           properties:
 *             _id:
 *               type: string
 *             fld_email:
 *               type: string
 *             fld_tipo:
 *               type: string
 *               enum:
 *                 - usuario
 *                 - recepcao
 *                 - profissional
 *                 - administrador
 *             fld_cadastroPessoaFisica:
 *               type: string
 *             fld_cartaoSUS:
 *               type: string
 *             fld_nome:
 *               type: string
 *             fld_nomeLegal:
 *               type: string
 *             fld_genero:
 *               type: string
 *             fld_generoAtribuidoNascimento:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_generoLegal:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_dataNascimento:
 *               type: string
 *             fld_filiacao:
 *               type: string
 *             fld_naturalidade:
 *               type: string
 *             fld_estadoCivil:
 *               type: string
 *               enum:
 *                 - Solteiro
 *                 - Casado
 *                 - Separado
 *                 - Divorciado
 *                 - Divorciado
 *             fld_profissao:
 *               type: string
 *             fld_ocupacao:
 *               type: string
 *             fld_escolaridade:
 *               type: string
 *               enum:
 *                 - Fundamental - Incompleto
 *                 - Fundamental - Completo
 *                 - Médio - Incompleto
 *                 - Médio - Completo
 *                 - Superior - Incompleto
 *                 - Superior - Completo
 *                 - Pós-graduação - Incompleto
 *                 - Pós-graduação - Completo
 *             fld_enderecoLogradouro:
 *               type: string
 *             fld_enderecoNumero:
 *               type: string
 *             fld_enderecoComplemento:
 *               type: string
 *             fld_enderecoBairro:
 *               type: string
 *             fld_enderecoCidade:
 *               type: string
 *               default: São Paulo
 *             fld_enderecoUF:
 *               type: string
 *               default: SP
 *             fld_enderecoPais:
 *               type: string
 *               default: Brasil
 *             fld_enderecoCEP:
 *               type: string
 *             fld_contatoCelular:
 *               type: string
 *             fld_contatoTelefone:
 *               type: string
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
  doUserSelect: function (req, res) {
    Col_usuarios.findById(req.body._id, {
      fld_senha: 0
    })
      .exec()
      .then(function (resultUser) {
        if(!resultUser){
          return res.status(400)
            .json({name:"Dados incorretos", message:"Usuário não encontrados"});
        }
        return res.status(200).json(resultUser);
      })
      .catch(function (err) {
        return res.status(500).json(auxFn.fnErrorClean(err));
      });
  },

/**
 * @swagger
 * /col_usuarios/update:
 *   post:
 *     summary: Altera usuário.
 *     description: |
 *       Atualiza os dados do perfil de um usuário selecionado.
 *     parameters:
 *       - name: dataPack
 *         in: body
 *         description: |
 *           JSON com código de identificação do usuário a alterar, e seus novos dados.
 *         required: true
 *         schema:
 *           properties:
 *             _id:
 *               type: string
 *             fld_email:
 *               type: string
 *             fld_senha:
 *               type: string
 *             fld_tipo:
 *               type: string
 *               enum:
 *                 - usuario
 *                 - recepcao
 *                 - profissional
 *                 - administrador
 *             fld_cadastroPessoaFisica:
 *               type: string
 *             fld_cartaoSUS:
 *               type: string
 *             fld_nome:
 *               type: string
 *             fld_nomeLegal:
 *               type: string
 *             fld_genero:
 *               type: string
 *             fld_generoAtribuidoNascimento:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_generoLegal:
 *               type: string
 *               enum:
 *                 - Feminino
 *                 - Masculino
 *             fld_dataNascimento:
 *               type: string
 *             fld_filiacao:
 *               type: string
 *             fld_naturalidade:
 *               type: string
 *             fld_estadoCivil:
 *               type: string
 *               enum:
 *                 - Solteiro
 *                 - Casado
 *                 - Separado
 *                 - Divorciado
 *                 - Divorciado
 *             fld_profissao:
 *               type: string
 *             fld_ocupacao:
 *               type: string
 *             fld_escolaridade:
 *               enum:
 *                 - Fundamental - Incompleto
 *                 - Fundamental - Completo
 *                 - Médio - Incompleto
 *                 - Médio - Completo
 *                 - Superior - Incompleto
 *                 - Superior - Completo
 *                 - Pós-graduação - Incompleto
 *                 - Pós-graduação - Completo
 *             fld_enderecoLogradouro:
 *               type: string
 *             fld_enderecoNumero:
 *               type: string
 *             fld_enderecoComplemento:
 *               type: string
 *             fld_enderecoBairro:
 *               type: string
 *             fld_enderecoCidade:
 *               type: string
 *               default: São Paulo
 *             fld_enderecoUF:
 *               type: string
 *               default: SP
 *             fld_enderecoPais:
 *               type: string
 *               default: Brasil
 *             fld_enderecoCEP:
 *               type: string
 *             fld_contatoCelular:
 *               type: string
 *             fld_contatoTelefone:
 *               type: string
 *           required:
 *             - _id
 *             - fld_senha
 *     tags:
 *       - User
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
  doUserUpdate: function (req, res) {
    // Remove _id from object to don't update
    var tempReqBodyId = req.body._id;
    delete req.body._id;

    // Remove type else is Administrator
    if (req.app.locals.credentialsToken.fld_tipo != "administrador") {
      delete req.body.fld_tipo;
    }

    // Adjust name observation
    if (req.body.fld_nome !== req.body.fld_nomeLegal) {
      req.body.fld_nome = req.body.fld_nome + "*";
    }

    function fnExecPosCripty (hash) {
      req.body.fld_senha = hash;
      Col_usuarios.findByIdAndUpdate(
        tempReqBodyId,
        { $set: req.body }
      )
        .exec()
        .then(function (resultUserUpdated) {
          if(!resultUserUpdated){
            return res.status(400)
              .json({
                name:"Dados incorretos",
                message:"Não foi possível alterar o usuário, confira os dados fornecidos e tente novamente"
              });
          }
          res.status(200).json({_id: tempReqBodyId});
        })
        .catch(function (err) {
          return res.status(500).json(auxFn.fnErrorClean(err));
        });
    }
    criptyPass(req.body.fld_senha, fnExecPosCripty);
  }
};
