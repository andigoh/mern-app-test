import express from 'express';
import { isAuthenticated } from '../middlewares/auth';
import { getDashboard } from '../controllers/dashboard.controller';

const dashboardRouter = express.Router();

dashboardRouter.get('/', isAuthenticated, getDashboard);

export default dashboardRouter;
