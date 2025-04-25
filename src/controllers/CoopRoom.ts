import CoopRoom from "../models/CoopRoom";
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { COOP_ROOM_MESSAGES, USER_MESSAGES } from "../consts/Messages";
import User from "../models/User";

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res.status(422).json({ msg: COOP_ROOM_MESSAGES.ROOM_NAME_REQUIRED });
  }

  const roomExists = await CoopRoom.findOne({ roomName });

  if (roomExists) {
    return res.status(422).json({ msg: COOP_ROOM_MESSAGES.ROOM_ALREADY_EXISTS });
  }

  const room = new CoopRoom({
    roomName,
    player1: req.user.userName,
    player2: null,
  });

  try {
    await room.save();
    res.status(201).json({ msg: COOP_ROOM_MESSAGES.ROOM_SAVED_SUCCESSFULLY, room });
  } catch (error) {
    res.status(500).json({ msg: COOP_ROOM_MESSAGES.ERROR_SAVING_ROOM, error });
  }
};

export const getRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const room = await CoopRoom.findById(id);

    return res.json(room);

  } catch (error) {
    return res.status(500).json({ msg: COOP_ROOM_MESSAGES.ROOM_NOT_FOUND, error });
  }
};
export const joinRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { roomName } = req.body;
  const userId = req.user.id;

  try {
    const room = await CoopRoom.findOne({ roomName });
    const user = await User.findById(userId);

    if (!room) return res.status(404).json({ message: COOP_ROOM_MESSAGES.ROOM_NOT_FOUND });
    if (!user) return res.status(404).json({ message: USER_MESSAGES.USER_NOT_FOUND });

    if (!room.player2) {
      room.player2 = user.userName;
      await room.save();
      return res.json({ message: COOP_ROOM_MESSAGES.JOIN_ROOM_SUCCESS, room });
    } else {
      return res.status(400).json({ message: COOP_ROOM_MESSAGES.ROOM_ALREADY_FULL });
    }
    
  } catch (error) {
    return res.status(500).json({ message: "Erro ao entrar na sala", error });
  }
};