"use server";

import puppeteer, { Page } from "puppeteer";
import fs from "fs";

import { Donor } from "./interfaces/Donor";

export const autoQuestionnaire = async (
    donorData: Donor,
    sendProgress: (progress: number, message?: string) => void
) => {
    const totalSteps: number = 37;
    let currentStep: number = 0;
    let currentQuestion: number = 1;

    const step = async (message?: string) => {
        currentStep++;
        sendProgress(
            Math.round((currentStep / totalSteps) * 100),
            message || ""
        );
        console.log(`Progress: ${(currentStep / totalSteps) * 100}%`);
    };

    await step("Launching Browser");
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    await step("Opening Page");
    const page = await browser.newPage();

    await step("Setting download preferences");
    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: "./public/QR-Images",
    });

    step("Navigating to page");
    await page.goto(
        "https://barcode.giveplasma.ca/Production_SK_ICASILaunch/Start.aspx?ictrkc=&icresky="
    );

    step("Donor number is in hand");
    await page.click("#MainContent_btnWithNumber");

    await new Promise((resolve) => setTimeout(resolve, 300));

    step("Entering dono information");
    await page.type(
        "#MainContent_tbDonorNumber",
        donorData.donorNumber.toString()
    );
    step();
    await page.type("#MainContent_tbLastName", donorData.donorLastName);
    step();
    await page.click("#MainContent_btnNext");

    await new Promise((resolve) => setTimeout(resolve, 300));
    step("Starting Questionnaire");

    try {
        await page.click("#MainContent_btnYes");
    } catch {
        sendProgress(0, "Failed. No appointment with that login");
        await browser.close();
        return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    step();
    await page.click("#MainContent_btnStart");

    await new Promise((resolve) => setTimeout(resolve, 300));
    step(`Question #${currentQuestion}`);
    await clickButton("MainContent_btnYes", page);
    currentQuestion++;
    for (let i = 0; i < 8; i++) {
        step(`Question #${currentQuestion}`);
        await clickButton("MainContent_btnNo", page);
        currentQuestion++;
    }
    step(`Question #${currentQuestion} (damn risk poster)`);
    await clickButton("MainContent_btnYes", page);
    currentQuestion++;
    for (let i = 0; i < 14; i++) {
        step(`Question #${currentQuestion}`);
        await clickButton("MainContent_btnNo", page);
        currentQuestion++;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    step("Finishing questionnaire");
    await page.click("#MainContent_btnEnd");
    await new Promise((resolve) => setTimeout(resolve, 300));

    step("Saving QR Image");
    await page.click("#MainContent_btnSave");

   

    sendProgress(100, "Questionnaire Complete!");
};

const clickButton = async (buttonID: string, page: Page) => {
    await page.evaluate((buttonID) => {
        const element = document.getElementById(buttonID);
        if (element) {
            element.classList.add("CASIQuestionAnswerButton");
            element.removeAttribute("disabled");
        } else {
            console.error("No button found with ID:", buttonID);
        }
    }, buttonID);
    await page.click(`#${buttonID}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
};
