const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const paises = await prisma.pais.findMany();
  const provincias = await prisma.provincia.findMany();
  const cantones = await prisma.canton.findMany();
  
  console.log('=== PAISES ===');
  console.log('Total:', paises.length);
  if (paises.length > 0) {
    console.log('Primeros 3:', paises.slice(0, 3).map(p => ({ id: p.id, nombre: p.nombre, codigo: p.codigo })));
  }
  
  console.log('\n=== PROVINCIAS ===');
  console.log('Total:', provincias.length);
  if (provincias.length > 0) {
    console.log('Primeras 3:', provincias.slice(0, 3).map(p => ({ id: p.id, nombre: p.nombre, codigo: p.codigo, paisId: p.paisId })));
  }
  
  console.log('\n=== CANTONES ===');
  console.log('Total:', cantones.length);
  if (cantones.length > 0) {
    console.log('Primeros 3:', cantones.slice(0, 3).map(c => ({ id: c.id, nombre: c.nombre, codigo: c.codigo, provinciaId: c.provinciaId })));
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
