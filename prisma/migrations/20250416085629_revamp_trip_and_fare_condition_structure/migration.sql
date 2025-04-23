/*
  Warnings:

  - You are about to drop the column `cancelLessThan48h` on the `trip` table. All the data in the column will be lost.
  - You are about to drop the column `cancelMoreThan48h` on the `trip` table. All the data in the column will be lost.
  - Added the required column `cancelLessThan48h` to the `FareCondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farecondition` ADD COLUMN `cancelLessThan48h` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `trip` DROP COLUMN `cancelLessThan48h`,
    DROP COLUMN `cancelMoreThan48h`;
