"use server";

import fs from "fs-extra";
import path from "path";
import { Donor } from "./interfaces/Donor";

export const writeDonoInfo = async (donor: Donor) => {
    const filePath = path.join("public", "data", "donorData.json");

    try {
        const fileExists = await fs.pathExists(filePath);

        if (fileExists) {
            const data = await fs.readFile(filePath, "utf8");
            const json = JSON.parse(data);

            // Check if the donor already exists in the array
            const index = json.donors.findIndex(
                (d: Donor) => d.donorNumber === donor.donorNumber
            );

            if (index === -1) {
                // Donor does not exist, add new donor
                json.donors.push(donor);
                await fs.writeFile(filePath, JSON.stringify(json, null, 2)); // Update the file with the new donor list
            } else {
                // Donor exists, optionally update the existing donor data or handle it as you see fit
                console.log(
                    `Donor with number ${donor.donorNumber} already exists.`
                );
                // For example, to update the donor data:
                // json.donors[index] = donor;
                // await fs.writeFile(filePath, JSON.stringify(json, null, 2));
            }
        } else {
            // If file doesn't exist, create it and write the initial array with the donor
            await fs.writeFile(
                filePath,
                JSON.stringify({ donors: [donor] }, null, 2)
            );
        }
    } catch (err) {
        console.error("Error writing donor information:", err);
    }
};
