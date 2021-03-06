'use strict';

const responses = require('../helpers/response');

const { ModelServers } = require('../models/server.model');

const { model } = new ModelServers();

const postServer = async (req, res) => {
  try {
    const exists = await model.findOne({
      where:{
        ipServer: req.body.ipServer
      }
    });

    if (exists) {
      return responses(res, 400, `Ya existe este server crack.`, true);
    }

    const result = await model.create({
      fk_user: req.uid,
      ...req.body
    });
    return responses(res, 200, result, false);
  } catch (error) {
    return responses(res, 500, error, true);
  }
}

const getServers = async (req, res) => {
  try {
    const result = await model.findAll({
      where:{
        fk_user: req.uid
      }
    });
    return responses(res, 200, result, false);
  } catch (error) {
    return responses(res, 500, error, true);
  }
}

const getServerByIp = async (req, res) => {
  try {
    const result = await model.findOne({
      where:{
        ipServer: req.query.ipServer,
        fk_user: req.uid
      }
    });

    return responses(res, 200, result, false);
  } catch (error) {
    return responses(res, 500, error, true);
  }
}

const putServer = async (req, res) => {
  try {
    const [ exists, register ] = await Promise.all([
      model.findOne({
        where:{
          id: req.query.id,
          fk_user: req.uid
        }
      }),
      model.findOne({
        where:{
          ipServer: req.body.ipServer,
        }
      }),
      
    ]);

    if (!exists) {
      return responses(res, 400, `El server que quieres actualizar no existe`, true);
    }

    if (register && exists.ipServer !== req.body.ipServer) {
      console.log(register.ipServer)
      console.log(exists.ipServer)
      console.log(req.body.ipServer)
      return responses(res, 400, `Ya esta registrado este server crack. `, true);
    }

    const result = await model.update(req.body, {
      where:{
        id: req.query.id,
        fk_user: req.uid,
      }
    });

    return responses(res, 200, result, false);
  } catch (error) {
    return responses(res, 500, error, true);
  }
}

const deleteServer = async (req, res) => {
  try {

    const exists = await model.findOne({
      where:{
        id: req.query.id
      }
    });

    if (!exists) {
      return responses(res, 400, `El server que quieres eliminar no existe`, true);
    }

    const result = await model.destroy({
      where:{
        id: req.query.id,
        fk_user: req.uid,
      }
    });
    return responses(res, 200, result, false);
  } catch (error) {
    return responses(res, 500, error, true);
  }
}

module.exports = {
  postServer,
  getServers,
  getServerByIp,
  putServer,
  deleteServer,
};
