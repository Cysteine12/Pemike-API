/*
  Warnings:

  - A unique constraint covering the columns `[reference,bookingId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Payment_reference_bookingId_key` ON `Payment`(`reference`, `bookingId`);
