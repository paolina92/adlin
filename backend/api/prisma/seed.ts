import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.equipement.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();

  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Salle #1',
        description: 'Salle #1',
        capacity: 5,
        createdAt: new Date('2016-12-07T12:39:29.812Z'),
        updatedAt: new Date('2016-12-08T17:31:39.489Z'),
        equipements: { create: [{ name: 'TV' }, { name: 'Retro Projecteur' }] },
      },
    }),
    prisma.room.create({
      data: {
        name: 'Salle #2',
        description: 'Salle #2',
        capacity: 10,
        createdAt: new Date('2016-12-07T12:39:55.384Z'),
        updatedAt: new Date('2016-12-07T13:33:37.184Z'),
        equipements: { create: [{ name: 'Retro Projecteur' }] },
      },
    }),
    prisma.room.create({
      data: {
        name: 'Salle Okjsdkso',
        description: 'Salle Okjsdkso',
        capacity: 11,
        createdAt: new Date('2016-12-07T14:15:55.733Z'),
        updatedAt: new Date('2016-12-09T16:45:19.025Z'),
        equipements: { create: [] },
      },
    }),
    prisma.room.create({
      data: {
        name: 'Salle de ouf',
        description: 'Salle de ouf',
        capacity: 10,
        createdAt: new Date('2016-12-09T16:45:34.419Z'),
        updatedAt: new Date('2016-12-09T16:45:34.419Z'),
        equipements: { create: [{ name: 'TV' }, { name: 'Retro Projecteur' }] },
      },
    }),
    prisma.room.create({
      data: {
        name: 'Salle nulle',
        description: 'Salle nulle',
        capacity: 26,
        createdAt: new Date('2016-12-09T16:45:49.096Z'),
        updatedAt: new Date('2016-12-09T16:45:49.096Z'),
        equipements: { create: [{ name: 'TV' }, { name: 'Retro Projecteur' }] },
      },
    }),
  ]);

  await prisma.reservation.createMany({
    data: [
      {
        roomId: rooms[0].id,
        startDate: new Date('2025-04-25T10:00:00Z'),
        endDate: new Date('2025-04-25T12:00:00Z'),
      },
      {
        roomId: rooms[1].id,
        startDate: new Date('2025-04-26T09:00:00Z'),
        endDate: new Date('2025-04-26T11:00:00Z'),
      },
      {
        roomId: rooms[3].id,
        startDate: new Date('2025-04-28T14:00:00Z'),
        endDate: new Date('2025-04-28T16:00:00Z'),
      },
    ],
  });

  console.log('✅ Seed complet effectué');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
