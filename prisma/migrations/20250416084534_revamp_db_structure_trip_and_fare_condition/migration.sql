/*
  Warnings:

  - You are about to drop the column `cancelLessThan48h` on the `farecondition` table. All the data in the column will be lost.
  - You are about to drop the column `cancelMoreThan48h` on the `farecondition` table. All the data in the column will be lost.
  - You are about to drop the column `firstChangePercent` on the `farecondition` table. All the data in the column will be lost.
  - You are about to drop the column `refundDays` on the `farecondition` table. All the data in the column will be lost.
  - You are about to drop the column `secondChangePercent` on the `farecondition` table. All the data in the column will be lost.
  - Added the required column `minWeeksBefore` to the `FareCondition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cancelLessThan48h` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cancelMoreThan48h` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refundDays` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondChangePercent` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `farecondition` DROP COLUMN `cancelLessThan48h`,
    DROP COLUMN `cancelMoreThan48h`,
    DROP COLUMN `firstChangePercent`,
    DROP COLUMN `refundDays`,
    DROP COLUMN `secondChangePercent`,
    ADD COLUMN `maxWeeksBefore` INTEGER NULL,
    ADD COLUMN `minWeeksBefore` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `trip` ADD COLUMN `cancelLessThan48h` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `cancelMoreThan48h` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `firstChangePercent` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `refundDays` INTEGER NOT NULL,
    ADD COLUMN `secondChangePercent` DECIMAL(65, 30) NOT NULL;
