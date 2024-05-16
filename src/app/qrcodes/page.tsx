import { ImageGrid } from "../components/ImageGrid";

export default function Page() {
    return (
        <div className="bg-[#cccccc] py-[5%] px-[5%]">
            <div className="margin-centered midmd:columns-1 relative justify-self">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#cccccc]">
                    <ImageGrid />
                </div>
            </div>
        </div>
    );
}
