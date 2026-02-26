const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando datos en PuebloYNacionalidad...');
  
  try {
    const count = await prisma.puebloYNacionalidad.count();
    console.log(`Total de registros: ${count}`);
    
    if (count > 0) {
      const primeros = await prisma.puebloYNacionalidad.findMany({
        take: 5,
        orderBy: { codigo: 'asc' }
      });
      console.log('\nPrimeros 5 registros:');
      primeros.forEach(p => {
        console.log(`  - ${p.codigo}: ${p.nombre} (ID: ${p.id})`);
      });
    } else {
      console.log('\n⚠️  La tabla está vacía. Necesitas insertar datos.');
      console.log('\nPara insertar datos de prueba, crea un script SQL o usa Prisma Studio.');
    }
  } catch (error) {
    console.error('Error al consultar la base de datos:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
