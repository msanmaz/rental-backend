import prisma from '../modules/db.mjs';
import { getCityIdByName, getPropertyTypeByName, addProperty as addPropertyToDB } from '../utils/helpers.mjs';

export const getAllHouses = async (req, res) => {
  try {
    const houses = await prisma.property.findMany({
      include: {
        city: true,
        propertyType: true,
        rentalDetail: true,
        saleDetail: true,
      },
    });
    res.status(200).json(houses);
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getHouseById = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await prisma.property.findUnique({
      where: { id: parseInt(id) },
      include: {
        city: true,
        propertyType: true,
        rentalDetail: true,
        saleDetail: true,
      },
    });
    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }
    res.status(200).json(house);
  } catch (error) {
    console.error('Error fetching house:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateHouse = async (req, res) => {
  const { id } = req.params;
  const propertyData = req.body;

  try {
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(id) },
      data: propertyData,
    });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const addHouse = async (req, res) => {
  try {
    const { title, description, address, cityName, propertyType, rooms, bathrooms, amenities, rentalDetail, saleDetail } = req.body;
    const cityId = await getCityIdByName(cityName);
    const propertyTypeId = await getPropertyTypeByName(propertyType);
    
    if (!cityId) {
      return res.status(400).json({ success: false, message: 'City name does not exist' });
    }

    const propertyData = {
      title,
      description,
      address,
      cityId,
      propertyTypeId,
      rooms,
      bathrooms,
      amenities,
      rentalDetail: rentalDetail ? { create: rentalDetail } : undefined,
      saleDetail: saleDetail ? { create: saleDetail } : undefined,
    };

    const property = await addPropertyToDB(propertyData);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();  // No content
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};