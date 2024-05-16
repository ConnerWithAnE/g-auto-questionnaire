import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const imagesDirectory = path.join(process.cwd(), 'public/QR-Images');
const donorDataDirectory = path.join(process.cwd(), 'public/data/donorData.json');

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
      await new Promise<{ numberOfImages: number; last_donation: string }>((resolve, reject) => {
        const imageFiles = fs.readdirSync(imagesDirectory);
        let mostRecentFile;
        let mostRecentTimestamp = 0;
        for (const fileName of imageFiles) {
          const filePath = path.join(imagesDirectory, fileName);
          const fileStats = fs.statSync(filePath);
          const fileTimestamp = fileStats.mtime.getTime(); // Use file modification time
          if (fileTimestamp > mostRecentTimestamp) {
            mostRecentTimestamp = fileTimestamp;
            mostRecentFile = fileName;
          }
      }
      if (mostRecentFile) {
        const datePart = mostRecentFile.match(/\d{8}/)?.[0];
        if (datePart) {
          

            const formattedDate = formatDate(
                `${datePart.slice(0, 4)}-${datePart.slice(
                    4,
                    6
                )}-${datePart.slice(6, 8)}`
            );
            resolve({ numberOfImages: imageFiles.length, last_donation: formattedDate });
        } else {
            resolve({ numberOfImages: imageFiles.length, last_donation: "Never" });
        }
    } else {
        resolve({ numberOfImages: 0, last_donation: "Never" });
    }
    
      }).then((value) => {
        const mostRecentFile = value.last_donation
        console.log(mostRecentFile)
        res.status(200).json({ number_of_images: value.numberOfImages,  last_donation: mostRecentFile});
      }).catch((error) => {
        console.error('Error reading image files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      })
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }