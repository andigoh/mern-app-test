import { Request, Response, NextFunction } from 'express';
import { getAllRegisterUsers } from '../services/user.service';
import { getActiveSessions } from '../services/session.service';

// Get all users that have signed up
export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  const users = await getAllRegisterUsers();

  const todayActiveSessions = await getActiveSessions();

  res.status(200).json({
    data: {
      users,
      totalUsers: users.length,
      todayActiveSessions,
    },
  });
};
