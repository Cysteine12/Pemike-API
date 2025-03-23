-- AlterTable
ALTER TABLE `seat` MODIFY `status` ENUM('available', 'reserved', 'booked') NOT NULL DEFAULT 'available';
