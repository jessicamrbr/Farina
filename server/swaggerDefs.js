module.exports = {
  "main": {
    "info": {
      "title": "Farina Server",
      "version": "1.0.0",
      "description": "Documentação da API de integração do sistema de PEP do Núcleo Farina",
      "contact": {
        "name": "Jéssica Moura Ribeiro",
        "email": "jessica_moura@outlook.com"
      }
    },
    "host": "localhost:3360",
    "schemes": ["https"],
    "basePath": "/",
    "produces": ["application/json"],
    "consumes": ["application/json"]
  },
  "securityDefinitions": {
    "token": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  },
  "definitions": {
    "Error": {
      "type": "object",
      "properties":{
        "name":{
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      }
    },
    "Id": {
      "type": "object",
      "properties":{
        "_id":{"type": "string"}
      }
    }
  }
}
