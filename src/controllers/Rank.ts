import { Request, Response } from 'express';
import Rank from '../models/Rank';
import User from '../models/User';
import { ALLRANKS } from '../consts/Rank';
import { RANK_MESSAGES, USER_MESSAGES } from '../consts/Messages';

export const updateUserRank = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rankPoints } = req.body;

  try {
    const user = await User.findById(id).select('rankPoints rank');
    if (!user) {
      return res.status(404).json({ message: USER_MESSAGES.USER_NOT_FOUND });
    }

    const findRank = await Rank.findById(user.rank);
    if (!findRank) {
      return res.status(404).json({ message: RANK_MESSAGES.RANK_NOT_FOUND });
    }

    if (rankPoints <= findRank.requiredPoints + 300) {
      const newRank = await Rank.findOne({ rank: findRank?.nextRank });

      await user.updateOne({ rank: newRank?._id });
      user.rankPoints = rankPoints;
      await user.save();
      return res.status(200).json({ message: RANK_MESSAGES.RANK_UPDATED_SUCCESSFULLY });

    } else {
      user.rankPoints = user?.rankPoints;
      return res.status(500).json({ message: RANK_MESSAGES.ERROR_FETCHING_RANK });
    }

  } catch (error) {
    console.error(RANK_MESSAGES.ERROR_UPDATING_RANK, error);
    return res.status(500).json({ message: RANK_MESSAGES.ERROR_UPDATING_RANK, error });
  }
}

export const create = async (req: Request, res: Response) => {

  try {
    for (let i = 0; i < ALLRANKS.length; i++) {
      const existingRank = await Rank.findOne({ rank: ALLRANKS[i] });

      if (!existingRank) {
        const newRank = new Rank({
          rank: ALLRANKS[i],
          requiredPoints: 300 * (i + 1),
          nextRank: ALLRANKS[i + 1]
        });
        await newRank.save();
      } else {
        return res.status(500).json({ msg: RANK_MESSAGES.RANK_ALREADY_EXISTS(ALLRANKS[i]) });
      }
    }
    return res.status(201).json({ msg: RANK_MESSAGES.RANK_SAVED_SUCCESSFULLY });

  } catch (error) {
    return res.status(500).json({ msg: RANK_MESSAGES.ERROR_SAVING_RANK, error });
  }
};

export const patch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedRank = await Rank.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedRank) {
      return res.status(404).json({ msg: RANK_MESSAGES.RANK_NOT_FOUND });
    }

    return res.json({ msg: RANK_MESSAGES.RANK_UPDATED_SUCCESSFULLY, rank: updatedRank });

  } catch (error) {
    return res.status(500).json({ msg: RANK_MESSAGES.ERROR_UPDATING_RANK, error });
  }
};

export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rank = await Rank.findById(id);

    if (!rank) {
      return res.status(404).json({ msg: RANK_MESSAGES.RANK_NOT_FOUND });
    }

    return res.json(rank);

  } catch (error) {
    return res.status(500).json({ msg: RANK_MESSAGES.ERROR_FETCHING_RANK, error });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rank = await Rank.findByIdAndDelete(id);

    if (!rank) {
      return res.status(404).json({ msg: RANK_MESSAGES.RANK_NOT_FOUND });
    }

    return res.json({ msg: RANK_MESSAGES.RANK_DELETED_SUCCESSFULLY });

  } catch (error) {
    return res.status(500).json({ msg: RANK_MESSAGES.ERROR_DELETING_RANK, error });
  }
};
