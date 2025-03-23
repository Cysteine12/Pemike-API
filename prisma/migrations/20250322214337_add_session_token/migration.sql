/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken,seatNo]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `seat` ADD COLUMN `sessionToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Seat_sessionToken_seatNo_key` ON `Seat`(`sessionToken`, `seatNo`);
