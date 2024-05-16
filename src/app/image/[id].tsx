import { useRouter } from "next/router";
import Image from "next/image";

const ImagePage = () => {
    const router = useRouter();
    const { id } = router.query; // Assuming the parameter name is 'id'

    if (!id) {
        return <div>Loading...</div>; // Add loading indicator or error handling
    }

    const imageUrl = `/QR-Images/${id}`; // Adjust the image path as per your file structure

    return (
        <div className="flex justify-center items-center h-screen">
            <Image
                src={imageUrl}
                alt="None"
                layout="fill"
                objectFit="contain"
            />
            <p>Hi</p>
        </div>
    );
};

export default ImagePage;
