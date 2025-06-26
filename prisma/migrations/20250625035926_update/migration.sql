/*
  Warnings:

  - Made the column `workHours` on table `contact_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `contact_info` MODIFY `workHours` VARCHAR(191) NOT NULL;
