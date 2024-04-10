const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
  InternalServerError,
} = require("../errors/index.js");
const Connection = require("../models/connection.js");
const axios = require("axios");
const { Op } = require("sequelize");

const createConnection = async (req, res, next) => {
  try {
    const { userId: person1Id } = req.user;
    const { person2Id, relation } = req.body;
    const { data: data1 } = await axios.get(
      `http://localhost:5001/user/getOneById/${person1Id}`
    );
    const { resUser: person1 } = data1;
    const { data: data2 } = await axios.get(
      `http://localhost:5001/user/getOneById/${person2Id}`
    );
    const { resUser: person2 } = data2;
    if (person1 && person2) {
      const connection = await Connection.findOne({
        where: {
          [Op.or]: [
            { [Op.and]: [{ person1: person1Id, person2: person2Id }] },
            { [Op.and]: [{ person1: person2Id, person2: person1Id }] },
          ],
        },
      });
      if (!connection) {
        const createdConnection = await Connection.create({
          person1: person1._id,
          person2: person2._id,
          relation,
          isVerified: false,
        });
        res.status(StatusCodes.CREATED).json({ connection: createdConnection });
      } else {
        const error = new BadRequestError("Connection already exists!!");
        next(error);
        return;
      }
    } else {
      const error = new NotFoundError("User not found!!");
      next(error);
      return;
    }
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      const error = new NotFoundError("User not found!!");
      next(error);
      return;
    }
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getAllConnections = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const connections = await Connection.findAll({
      where: { [Op.or]: [{ person1: userId }, { person2: userId }] },
    });
    res.status(StatusCodes.OK).json({ connections });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getAllConnectionsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const connections = await Connection.findAll({
      where: { [Op.or]: [{ person1: userId }, { person2: userId }] },
    });
    res.status(StatusCodes.OK).json({ connections });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getAllPendingConnections = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ person1: userId }, { person2: userId }],
        isVerified: false,
      },
    });
    res.status(StatusCodes.OK).json({ connections });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const verifyConnection = async (req, res, next) => {
  const { userId } = req.user;
  const { connectionId } = req.params;
  try {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Connection not found!!" });
    }
    if (connection.person2 !== userId) {
      const error = new BadRequestError(
        "You're Not Authorized to Verify This Connection!!"
      );
      next(error);
      return;
    }
    await connection.update({ isVerified: true });
    res.status(StatusCodes.OK).json({ msg: "Connection Verified!!" });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const removeConnection = async (req, res, next) => {
  const { userId } = req.user;
  const { connectionId } = req.params;
  try {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Connection not found!!" });
    }
    if (connection.person1 !== userId && connection.person2 !== userId) {
      const error = new BadRequestError(
        "You're Not Authorized to Remove This Connection!!"
      );
      next(error);
      return;
    }
    await connection.destroy();
    res.status(StatusCodes.OK).json({ msg: "Connection Removed!!" });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const updateConnection = async (req, res, next) => {
  const { userId: person1Id } = req.user;
  const { connectionId } = req.params;
  const { person2Id, relation } = req.body;
  if (!person1Id || !person2Id || !relation) {
    const error = new BadRequestError("Provide All Values!!");
    next(error);
    return;
  }
  try {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      const error = new NotFoundError("Connection not found!!");
      next(error);
      return;
    }
    if (connection.isVerified === true) {
      const error = new BadRequestError(
        "Connection Already Verified, You Can't Edit it!!"
      );
      next(error);
      return;
    }
    if (connection.person1 !== person1Id) {
      const error = new BadRequestError("You Can't Edit this connection!!");
      next(error);
      return;
    }
    await connection.update({ person1Id, person2Id, relation });
    res.status(StatusCodes.OK).json({ msg: "Connection Updated!!" });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const deleteConnection = async (req, res, next) => {
  const { userId } = req.user;
  const { connectionId } = req.params;
  try {
    const connection = await Connection.findByPk(connectionId);
    if (!connection) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Connection not found!!" });
    }
    if (connection.person2 !== userId && connection.person1 !== userId) {
      const error = new BadRequestError(
        "You're Not Authorized to Delete This Request!!"
      );
      next(error);
      return;
    }
    await connection.destroy();
    res.status(StatusCodes.OK).json({ msg: "Connection Deleted!!" });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const deleteCascade = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Connection.destroy({
      where: { [Op.or]: [{ person1: id }, { person2: id }] },
    });
    res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const findMutualConnection = async (req, res, next) => {
  const { userId: person1Id } = req.user;
  const { person2Id } = req.params;
  try {
    const { data: data1 } = await axios.get(
      `http://localhost:5001/user/getOneById/${person1Id}`
    );
    const { resUser: person1 } = data1;
    const { data: data2 } = await axios.get(
      `http://localhost:5001/user/getOneById/${person2Id}`
    );
    const { resUser: person2 } = data2;
    if (!person1 || !person2) {
      const error = new NotFoundError("User not found!!");
      next(error);
      return;
    }
    const connection1 = await Connection.findAll({
      where: { [Op.or]: [{ person1: person1Id }, { person2: person1Id }] },
    });
    const connection2 = await Connection.findAll({
      where: { [Op.or]: [{ person1: person2Id }, { person2: person2Id }] },
    });
    const friends1 = connection1.map((connection) => {
      return connection.person1 === person1Id
        ? connection.person2
        : connection.person1;
    });
    const friends2 = connection2.map((connection) => {
      return connection.person1 === person2Id
        ? connection.person2
        : connection.person1;
    });
    const mutualFriends = friends1.filter(Set.prototype.has, new Set(friends2));
    res.status(StatusCodes.OK).json({ mutualFriends });
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      const error = new NotFoundError("User not found!!");
      next(error);
      return;
    }
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const findConnectionCount = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const count = await Connection.count({
      where: {
        [Op.or]: [{ person1: userId }, { person2: userId }],
      },
    });
    res.status(StatusCodes.OK).json({ count });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getConnectionByUserId = async (req, res, next) => {
  const { userId: person1Id } = req.user;
  const { userId: person2Id } = req.params;
  try {
    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ person1: person1Id, person2: person2Id }] },
          { [Op.and]: [{ person1: person2Id, person2: person1Id }] },
        ],
      },
    });
    if (connection) {
      res.status(StatusCodes.OK).json({ connection });
    } else {
      const error = new NotFoundError("Connection not found!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

module.exports = {
  createConnection,
  getAllConnections,
  getAllPendingConnections,
  verifyConnection,
  removeConnection,
  updateConnection,
  deleteConnection,
  findMutualConnection,
  findConnectionCount,
  getConnectionByUserId,
  getAllConnectionsByUserId,
  deleteCascade,
};
