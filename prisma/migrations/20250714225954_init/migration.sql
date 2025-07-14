/*
  Warnings:

  - You are about to drop the column `puntaje` on the `Calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `masPopular` on the `Juego` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[juegoId,plataformaId]` on the table `JuegoPlataforma` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comentario` to the `Calificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Calificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valoracion` to the `Calificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `Venta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoPagado` to the `Venta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calificacion" DROP COLUMN "puntaje",
ADD COLUMN     "comentario" TEXT NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ADD COLUMN     "valoracion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Juego" DROP COLUMN "masPopular";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "foto" TEXT,
ADD COLUMN     "token" TEXT;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "montoPagado" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Noticia" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "foto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JuegoPlataforma_juegoId_plataformaId_key" ON "JuegoPlataforma"("juegoId", "plataformaId");

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
