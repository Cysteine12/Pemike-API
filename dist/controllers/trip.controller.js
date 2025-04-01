var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tripService } from '../services';
import { NotFoundError } from '../middlewares/errorHandler';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
const getTrips = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const options = { page: Number(page), limit: Number(limit) };
    const trips = yield tripService.findTrips(options);
    res.status(200).json({
        success: true,
        data: trips,
    });
}));
const searchTripsByParams = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = pick(req.query, ['source', 'destination']);
    const trips = yield tripService.searchTrips(filter, {});
    res.status(200).json({
        success: true,
        data: trips,
    });
}));
const getTrip = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const trip = yield tripService.findTripById(id);
    if (!trip) {
        throw new NotFoundError('Trip not found');
    }
    res.status(200).json({
        success: true,
        data: trip,
    });
}));
export default {
    getTrips,
    searchTripsByParams,
    getTrip,
};
