import express from 'express';
import { RoomsController } from '../controllers/roomsController';
import { ReservationsController } from 'src/controllers/reservationsController';

const apiRouter = express.Router();

// Rotas de salas
apiRouter.get('/rooms', RoomsController.getAllRooms);
apiRouter.get('/rooms/:id', RoomsController.getRoomById);
apiRouter.post('/rooms', RoomsController.createRoom);
apiRouter.put('/rooms/:id', RoomsController.updateRoom);
apiRouter.delete('/rooms/:id', RoomsController.deleteRoom);


// Rotas de reserva
apiRouter.post('/booking', ReservationsController.create)
apiRouter.put('/booking/:id/attData', ReservationsController.updateDate)
apiRouter.delete('/booking/:id/cancel', ReservationsController.cancel)

export default apiRouter;