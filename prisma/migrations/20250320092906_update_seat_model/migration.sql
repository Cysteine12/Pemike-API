/*
  Warnings:

  - You are about to drop the column `bookingId` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the `booking` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `seat` DROP FOREIGN KEY `Seat_bookingId_fkey`;

-- DropIndex
DROP INDEX `Seat_bookingId_fkey` ON `seat`;

-- AlterTable
ALTER TABLE `seat` DROP COLUMN `bookingId`,
    ADD COLUMN `status` ENUM('available', 'reserved', 'booked') NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `seatNo` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `booking`;

-- AddForeignKey
ALTER TABLE `Seat` ADD CONSTRAINT `Seat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
