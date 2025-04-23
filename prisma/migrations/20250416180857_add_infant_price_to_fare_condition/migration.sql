/*
  Warnings:

  - The values [ADULT] on the enum `Seat_passengerType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `infantPrice` to the `FareCondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farecondition` ADD COLUMN `infantPrice` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `seat` MODIFY `passengerType` ENUM('ADULT_WITHOUT_INFANT', 'ADULT_WITH_INFANT', 'CHILD') NULL;
