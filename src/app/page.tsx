"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Donor } from "./interfaces/Donor";
import { writeDonoInfo } from "./WriteDonoInfo";

export default function Home() {
    const [saveInfo, setSaveInfo] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [donorNumber, setDonorNumber] = useState<number | "">("");
    const [donorLastName, setDonorLastName] = useState<string>("");

    const toggleInfo = () => setSaveInfo(!saveInfo);
    const toggleInProgress = () => setInProgress(!inProgress);

    useEffect(() => {
        const fetchDonorData = async () => {
            const response = await fetch("/data/donorData.json"); // adjust the path as needed
            const data = await response.json();
            console.log(data.donors.length);
            if (data.donors.length > 0) {
                const firstDonor = data.donors[0]; // Assuming you want to load the first donor
                setDonorNumber(firstDonor.donorNumber);
                setDonorLastName(firstDonor.donorLastName);
            }
        };

        fetchDonorData();
    }, []);

    const getCurrentDate = (): string => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const performQuestionnaire = () => {
        if (donorNumber != "" && donorLastName != "") {
            toggleInProgress();
            const donor: Donor = {
                donorNumber: donorNumber as number,
                donorLastName: donorLastName,
            };

            if (saveInfo) {
                writeDonoInfo(donor);
            }

            const eventSource = new EventSource(
                `/api/progress?donorNumber=${donor.donorNumber}&donorLastName=${donorLastName}`
            );

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setProgress(data.progress);
                if (data.message != "") setMessage(data.message);
                if (data.progress == 100) eventSource.close();
            };

            

            eventSource.onerror = (event) => {
                console.error("EventSource failed:", event);
                eventSource.close();
            };
            toggleInProgress();
            // Close the connection when the component unmounts
            return () => eventSource.close();
        } else {
            alert("Name and Donor Number Required");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-between bg-[#cccccc] text-black">
            <div className="m-[10%] md:m-[5%]">
                <div className="pb-[10%]">
                    <div className="flex flex-row items-center text-center justify-center">
                        <div className="w-[50px] h-[50px] flex justify-center items-center relative md:w-[100px] md:h-[100px] ">
                            <Image
                                src="/images/grifols.png"
                                width={100}
                                height={100}
                                alt={"Grifols"}
                                className="rounded-xl object-contain"
                            />
                        </div>

                        <h1 className="text-3xl md:text-5xl px-[3%] font-semibold">
                            Plasma
                        </h1>
                    </div>
                    <div className="flex justify-center flex-row">
                        <h1 className="p-1 text-3xl md:text-5xl font-semibold">
                            Auto
                        </h1>
                        <h1 className="p-1 text-3xl md:text-5xl font-semibold">
                            Questionnaire
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col justify-center md:flex-row">
                    <input
                        id="DonorNumber"
                        placeholder="Donor Number"
                        type="number"
                        inputMode="numeric"
                        value={donorNumber}
                        onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                                setDonorNumber(parseInt(e.target.value));
                            }
                        }}
                        className="mb-[4%] md:mx-[3%] p-2 rounded-lg focus:outline-none hide-number-arrows"
                    />
                    <input
                        id="LastName"
                        placeholder="Last Name"
                        type="text"
                        value={donorLastName}
                        onChange={(e) => setDonorLastName(e.target.value)}
                        className="mb-[4%] md:mx-[3%] p-2 rounded-lg focus:outline-none"
                    />
                </div>
                <div className="justify-center items-center flex py-[5%]">
                    <input
                        type="checkbox"
                        id="saveData"
                        name="saveDataBox"
                        checked={saveInfo}
                        onChange={toggleInfo}
                        className="transform scale-150"
                    ></input>
                    <label htmlFor="saveDataBox" className="pl-2">
                        Save Dono Info
                    </label>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-white p-2 rounded-lg hover:bg-gray-100"
                        onClick={performQuestionnaire}
                    >
                        Complete Questionaire
                    </button>
                </div>
                <div className="p-10 min-h-16">
                    <div className="inset-0 flex items-center justify-center text-black font-semibold text-nowrap">
                        {message}
                    </div>
                </div>
                <div className="w-full bg-gray-200 h-8 rounded-md overflow-hidden">
                    <div
                        className={`bg-blue-500 h-full ${
                            progress < 100 ? "text-end" : "text-center"
                        } pt-1`}
                        style={{ width: `${progress}%` }}
                    >
                        <div className="px-2">{progress}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
