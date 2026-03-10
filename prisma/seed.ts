import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@gamestore.es' },
    update: {},
    create: {
      correo: 'admin@gamestore.es',
      password: adminPassword,
      nombre: 'Administrador',
      pais: 'El Salvador',
    },
  });

  console.log('✅ Usuario admin creado:', admin.correo);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
