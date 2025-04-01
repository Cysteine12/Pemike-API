/*
  Warnings:

  - Made the column `blacklisted` on table `token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `token` MODIFY `blacklisted` BOOLEAN NOT NULL DEFAULT false;
