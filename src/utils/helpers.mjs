import prisma from "../modules/db.mjs";

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

// async function addTestCities() {
//   const cities = [
//     { name: "Istanbul" },
//     { name: "Bodrum" },
//     { name: "Stuttgart" }
//   ];

//   for (let city of cities) {
//     await prisma.city.create({ data: city });
//   }
// }

// async function addTestPropertyTypes() {
//   const propertyTypes = [
//     { name: "Apartment" },
//     { name: "Commercial" },
//     { name: "Villa" }
//   ];

//   for (let propertyType of propertyTypes) {
//     await prisma.propertyType.create({ data: propertyType });
//   }
// }
