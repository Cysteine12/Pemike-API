/*
  Warnings:

  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `seat` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(1))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(4))`.
  - The values [bus,car] on the enum `Vehicle_category` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_firstName_lastName_key` ON `user`;

-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS';

-- AlterTable
ALTER TABLE `seat` MODIFY `status` ENUM('AVAILABLE', 'RESERVED', 'BOOKED') NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `role` ENUM('CUSTOMER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE `vehicle` MODIFY `category` ENUM('BUS', 'CAR') NOT NULL;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `type` ENUM('ACCESS', 'REFRESH', 'VERIFY_EMAIL', 'RESET_PASSWORD') NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `blacklisted` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
