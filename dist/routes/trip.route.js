import express from 'express';
import { tripController } from '../controllers';
const router = express.Router();
router.get('/', tripController.getTrips);
router.get('/search', tripController.searchTripsByParams);
router.get('/:id', tripController.getTrip);
export default router;
