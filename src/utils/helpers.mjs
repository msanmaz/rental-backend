import prisma from "../modules/db.mjs";
import bcrypt from 'bcrypt';


export const getProperties = async () => {
  return await prisma.property.findMany({
    include: {
      city: true,
      propertyType: true,
      rentalDetail: true,
      saleDetail: true,
    },
  });
};

export const addProperty = async (propertyData) => {
  return await prisma.property.create({
    data: propertyData,
  });
};

export const getCityIdByName = async (cityName) => {
  const city = await prisma.city.findUnique({
    where: { name: cityName },
  });
  return city ? city.id : null;
};

export const getPropertyTypeByName = async (propertyType) => {
  const city = await prisma.propertyType.findUnique({
    where: { name: propertyType },
  });
  return city ? city.id : null;
};

async function addTestCities() {
  const cities = [
    { name: "Istanbul" },
    { name: "Bodrum" },
    { name: "Stuttgart" }
  ];

  for (let city of cities) {
    await prisma.city.create({ data: city });
  }
}


async function addTestPropertyTypes() {
  const propertyTypes = [
    { name: "Apartment" },
    { name: "Commercial" },
    { name: "Villa" }
  ];

  for (let propertyType of propertyTypes) {
    await prisma.propertyType.create({ data: propertyType });
  }
}

// async function addAdmin(){
//   const adminEmail = 'admin@example.com';
//   const adminPassword = 'admin123';
//   const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
//   await prisma.admin.create({
//     data: {
//       email: adminEmail,
//       password: hashedPassword,
//     },
//   });
// }

// addAdmin()





// async function main() {
//   // Create some cities
//   const istanbul = await prisma.city.create({
//     data: { name: 'Istanbul' },
//   });

//   const newYork = await prisma.city.create({
//     data: { name: 'New York' },
//   });

//   const london = await prisma.city.create({
//     data: { name: 'London' },
//   });

//   // Create some property types
//   const apartment = await prisma.propertyType.create({
//     data: { name: 'Apartment' },
//   });

//   const villa = await prisma.propertyType.create({
//     data: { name: 'Villa' },
//   });

//   const commercial = await prisma.propertyType.create({
//     data: { name: 'Commercial' },
//   });

//   // Create some properties
//   await prisma.property.create({
//     data: {
//       title: 'Luxury Apartment in Istanbul',
//       description: 'A beautiful luxury apartment in the heart of Istanbul.',
//       address: '123 Istanbul St',
//       cityId: istanbul.id,
//       propertyTypeId: apartment.id,
//       rooms: 3,
//       bathrooms: 2,
//       amenities: ['Pool', 'Gym', 'Parking'],
//       rentalDetail: {
//         create: {
//           rent: 3000,
//           available: true,
//         },
//       },
//     },
//   });

//   await prisma.property.create({
//     data: {
//       title: 'Spacious Villa in New York',
//       description: 'A spacious villa located in a quiet neighborhood.',
//       address: '456 New York Ave',
//       cityId: newYork.id,
//       propertyTypeId: villa.id,
//       rooms: 5,
//       bathrooms: 4,
//       amenities: ['Garden', 'Garage', 'Basement'],
//       saleDetail: {
//         create: {
//           price: 750000,
//           available: true,
//         },
//       },
//     },
//   });

//   await prisma.property.create({
//     data: {
//       title: 'Modern Commercial Space in London',
//       description: 'A modern commercial space in the business district.',
//       address: '789 London Rd',
//       cityId: london.id,
//       propertyTypeId: commercial.id,
//       rooms: 0,
//       bathrooms: 1,
//       amenities: ['High-speed Internet', 'Conference Room'],
//       rentalDetail: {
//         create: {
//           rent: 5000,
//           available: true,
//         },
//       },
//     },
//   });

//   const adminEmail = 'admin@example.com';
//   const adminPassword = 'admin123';
//   const hashedPassword = await bcrypt.hash(adminPassword, 10);

//   await prisma.admin.create({
//     data: {
//       email: adminEmail,
//       password: hashedPassword,
//     },
//   });


//   console.log('Database has been seeded. 🌱');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
