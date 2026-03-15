/*
  Warnings:

  - You are about to drop the column `foto` on the `Juego` table. All the data in the column will be lost.
  - The `descuento` column on the `Juego` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Calificacion" ALTER COLUMN "valoracion" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Juego" DROP COLUMN "foto",
DROP COLUMN "descuento",
ADD COLUMN     "descuento" DOUBLE PRECISION;
