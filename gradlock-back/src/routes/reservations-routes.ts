import express from 'express';
import { authenticate } from '../middlewares/auth-middlewares';
import { ReservationsController } from 'src/controllers/reservationsController';

const reservationRouter = express.Router();

reservationRouter.post('/booking', authenticate, ReservationsController.create)
reservationRouter.put('/booking/:id/attData', authenticate, ReservationsController.updateDate)
reservationRouter.delete('/booking/:id/cancel', authenticate, ReservationsController.cancel)

export default reservationRouter