/*
  Warnings:

  - You are about to drop the column `fare` on the `trip` table. All the data in the column will be lost.
  - Added the required column `fareConditionId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `change_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fareConditionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'CANCELED', 'CHANGED') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `seat` ADD COLUMN `passengerType` ENUM('ADULT', 'CHILD') NULL;

-- AlterTable
ALTER TABLE `trip` DROP COLUMN `fare`;

-- CreateTable
CREATE TABLE `FareCondition` (
    `id` VARCHAR(191) NOT NULL,
    `conditionLabel` ENUM('WEEK_0_TO_2', 'WEEK_2_TO_4', 'WEEK_MORE_THAN_4') NOT NULL,
    `adultPrice` DECIMAL(65, 30) NOT NULL,
    `childPrice` DECIMAL(65, 30) NOT NULL,
    `firstChangePercent` DECIMAL(65, 30) NOT NULL,
    `secondChangePercent` DECIMAL(65, 30) NOT NULL,
    `cancelLessThan48h` DECIMAL(65, 30) NOT NULL,
    `cancelMoreThan48h` DECIMAL(65, 30) NOT NULL,
    `refundDays` INTEGER NOT NULL,
    `tripId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FareCondition_conditionLabel_tripId_key`(`conditionLabel`, `tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_fareConditionId_fkey` FOREIGN KEY (`fareConditionId`) REFERENCES `FareCondition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FareCondition` ADD CONSTRAINT `FareCondition_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
