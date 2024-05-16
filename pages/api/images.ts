import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const imagesDirectory = path.join(process.cwd(), 'public/QR-Images');

const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00Z`); // Append 'T00:00:00Z' to indicate UTC time
  const options: Intl.DateTimeFormatOptions = {
      timeZone: 'UTC', // Specify timezone as UTC
      month: "long",
      day: "numeric",
      year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const imageFiles = fs.readdirSync(imagesDirectory);
      const imagesData = [];

      for (const fileName of imageFiles) {
        const filePath = path.join(imagesDirectory, fileName);
        const fileData = fs.readFileSync(filePath);
        const base64Data = fileData.toString('base64');
        const datePart = fileName.match(/\d{8}/)?.[0];
    if (datePart) {
        const formattedDate = formatDate(
            `${datePart.slice(0, 4)}-${datePart.slice(
                4,
                6
            )}-${datePart.slice(6, 8)}`
        );
        imagesData.push({
            image: base64Data,
            date: formattedDate,
        });
    }}

    imagesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.status(200).json({ images: imagesData });
    } catch (error) {
      console.error('Error reading image files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}