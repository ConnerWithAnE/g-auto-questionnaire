'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageGridCell {
    image: string;
    date: string;
}

type ImageGridProps = {
    cellData: ImageGridCell[];
    backgroundColour?: string;
};




export const ImageGrid = () => {
    const [images, setImages] = useState<ImageGridCell[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/images');
                if (response.ok) {
                    const data = await response.json();
                    setImages(data.images);
                } else {
                    console.error('Failed to fetch images:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <>
            {images.map((image, index) => (
                <div key={index} className="relative flex justify-center items-center">
                    <div className="w-full h-full">
                        <Image
                            src={`data:image/jpeg;base64,${image.image}`}
                            alt={`${image.toString}`}
                            width={250}
                            height={250}
                            className="mx-auto mb-2"
                        />
                        <h3 className="w-full text-black text-center items-center text-sm md:text-lg lg:text-2xl xl:text-1xl font-bold pt-[3%]">
                            {image.date}
                        </h3>
                    </div>
                </div>
            ))}
        </>
    );
};
