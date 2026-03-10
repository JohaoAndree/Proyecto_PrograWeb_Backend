/*
  Warnings:

  - A unique constraint covering the columns `[juegoId,usuarioId]` on the table `Calificacion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "JuegoPlataforma" DROP CONSTRAINT "JuegoPlataforma_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "JuegoPlataforma" DROP CONSTRAINT "JuegoPlataforma_plataformaId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "tokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_juegoId_usuarioId_key" ON "Calificacion"("juegoId", "usuarioId");

-- CreateIndex
CREATE INDEX "Venta_usuarioId_idx" ON "Venta"("usuarioId");

-- CreateIndex
CREATE INDEX "Venta_juegoId_idx" ON "Venta"("juegoId");

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuegoPlataforma" ADD CONSTRAINT "JuegoPlataforma_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuegoPlataforma" ADD CONSTRAINT "JuegoPlataforma_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "Plataforma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
