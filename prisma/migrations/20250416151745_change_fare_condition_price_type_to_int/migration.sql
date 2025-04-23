/*
  Warnings:

  - You are about to alter the column `adultPrice` on the `farecondition` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `childPrice` on the `farecondition` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `farecondition` MODIFY `adultPrice` INTEGER NOT NULL,
    MODIFY `childPrice` INTEGER NOT NULL;
