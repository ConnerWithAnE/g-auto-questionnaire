"use client";

import Link from "next/link";
import { useState } from "react";
import Dropdown from "./Dropdown-Selection";
import { MenuItem, menuItems } from "../interfaces/Menuitems";
import { useMediaQuery } from "./useScreenSize";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const isBreakPoint = useMediaQuery(820);

    return (
        <nav className="bg-[#cccccc] text-gray-950 relative">
            {/* White background for sliding effect */}
            <div
                className={`fixed top-0 left-0 w-screen md:w-[20%] h-screen bg-white z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={() => {
                    setIsOpen(false);
                }}
            />

            <div className="container mx-auto flex justify-between items-center relative z-50">
                <div className=" flex flex-col justify-center items-center pl-4" id="burger">
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    >
                        <span
                            className={`bg-black block transition-all duration-300 ease-out
                            h-0.5 w-6 rounded-sm ${
                                isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                            }`}
                        ></span>
                        <span
                            className={`bg-black block transition-all duration-300 ease-out
                            h-0.5 w-6 rounded-sm my-0.5 ${
                                isOpen ? "opacity-0" : "opacity-100"
                            }`}
                        ></span>
                        <span
                            className={`bg-black block transition-all duration-300 ease-out
                            h-0.5 w-6 rounded-sm ${
                                isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                            }`}
                        ></span>
                    </button>
                </div>
                    <div className="relative w-24 h-16 sm:w-32 sm:h-32 md:w-30 md:h-30 lg:w-30 lg:h-30"></div>
            
                <div
                    className={`absolute top-[90px] sm:top-[125px] bg-colour-light w-full p-4 left-0 gap-10 flex-col flex items-baseline ${
                        isOpen ? "" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
                >
                    {menuItems.map((item) => {
                        return item.hasOwnProperty("children") ? (
                            <Dropdown
                                key={item.route}
                                item={item}
                                toggleNavbar={toggle}
                            />
                        ) : (
                            <Link
                                key={item?.route || ""}
                                href={item?.route || ""}
                                className="hover:text-black font-semibold md:text-xl lg:text-xl"
                                onClick={() => {
                                    
                                        setIsOpen(!isOpen);
                                    
                                }}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
