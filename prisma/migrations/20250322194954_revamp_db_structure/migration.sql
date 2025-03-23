/*
  Warnings:

  - You are about to drop the column `userId` on the `seat` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `seat` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.
  - You are about to drop the column `available` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `availableSeats` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `departureLocation` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `tripRound` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `driverId` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `passengerSeats` on the `vehicle` table. All the data in the column will be lost.
  - Added the required column `source` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPassengerSeat` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Made the column `brand` on table `vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `seat` DROP FOREIGN KEY `Seat_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicle` DROP FOREIGN KEY `Vehicle_driverId_fkey`;

-- DropIndex
DROP INDEX `Seat_userId_fkey` ON `seat`;

-- DropIndex
DROP INDEX `Vehicle_driverId_fkey` ON `vehicle`;

-- AlterTable
ALTER TABLE `seat` DROP COLUMN `userId`,
    ADD COLUMN `bookingId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('available', 'booked') NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE `trip` DROP COLUMN `available`,
    DROP COLUMN `availableSeats`,
    DROP COLUMN `departureLocation`,
    DROP COLUMN `tripRound`,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `color`,
    DROP COLUMN `driverId`,
    DROP COLUMN `passengerSeats`,
    ADD COLUMN `totalPassengerSeat` INTEGER NOT NULL,
    MODIFY `brand` VARCHAR(191) NOT NULL,
    MODIFY `model` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tripId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booking_userId_tripId_key`(`userId`, `tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('success', 'failed') NOT NULL DEFAULT 'success',
    `bookingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seat` ADD CONSTRAINT `Seat_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
