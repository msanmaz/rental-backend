import { getProperties } from "../modules/prisma.mjs";


export const getHouses = async (req, res) => {
  try {
    const data = await getProperties();
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};