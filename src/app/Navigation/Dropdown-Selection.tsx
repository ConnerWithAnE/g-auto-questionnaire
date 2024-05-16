import Link from "next/link";
import { MenuItem } from "../interfaces/Menuitems";
import { useState, useRef, useCallback, useEffect } from "react";
import { HiChevronRight } from "react-icons/hi";

import { useMediaQuery } from "./useScreenSize";

interface Props {
    item: MenuItem;
    toggleNavbar: () => void;
}

export default function Dropdown(props: Props) {
    const { item, toggleNavbar } = props;
    const [isOpen, setIsOpen] = useState(false);
    const menuItems = item?.children ? item.children : [];
    const timeoutRef = useRef<NodeJS.Timeout>();

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 50); // Adjust the delay time as needed (in milliseconds)
    };

    const isBreakPoint = useMediaQuery(820);

    return isBreakPoint ? (
        <div className="relative">
            <button
                className={`hover:text-gray-100 ${
                    /* idk why this ml-2 looks bad on browser phone but good on my iphone*/ 0
                } ml-2 font-semibold md:text-xl flex items-center lg:text-xl whitespace-nowrap cursor-default`}
                onClick={toggle}
            >
                {item.title}
                <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}><HiChevronRight /></span>
            </button>

            <div
                className={`md:absolute md:top-8 md:z-30 flex flex-col md:py-4 md:bg-zinc-100 md:rounded-md md:border md:border-black ${
                    isOpen ? "flex" : "hidden"
                }`}
            >
                {menuItems.map((item) => (
                    <Link
                        key={item.route || ""}
                        className="hover:text-gray-200 px-4 py-1 whitespace-nowrap"
                        href={item?.route || ""}
                        onClick={() => {
                            toggleNavbar();
                            toggle();
                        }}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    ) : (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <p className=" hover:text-gray-100 font-semibold md:text-xl flex items-center lg:text-xl whitespace-nowrap cursor-default">
                {item.title}
            </p>
            <div
                className={`md:top-8 md:z-30 flex flex-col md:py-4 md:bg-zinc-100 md:rounded-md md:border md:border-gray-100 ${
                    isOpen ? "flex" : "hidden"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {menuItems.map((item) => (
                    <Link
                        key={item.route}
                        className="hover:gray-100 px-4 py-1 whitespace-nowrap"
                        href={item?.route || ""}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
