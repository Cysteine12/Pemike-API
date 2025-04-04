/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `seat` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Seat_sessionToken_seatNo_key` ON `seat`;

-- AlterTable
ALTER TABLE `seat` DROP COLUMN `sessionToken`;
