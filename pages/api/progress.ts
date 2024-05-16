import type { NextApiRequest, NextApiResponse } from "next";
import { ServerResponse } from "http";
import { autoQuestionnaire } from "../../src/app/AutoQuestionnaire";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ServerResponse>
) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");

    const customRes: any = res;

    const sendProgress = (progress: number, message?: string) => {
        customRes.write(`data: ${JSON.stringify({ progress, message })}\n\n`);
        // Attempt to flush using the underlying socket
        customRes.flush();
    };

    // Start the process and listen for updates
    const { donorNumber, donorLastName } = req.query;
    const donorData = {
        donorNumber: Number(donorNumber),
        donorLastName: donorLastName as string,
    };

    autoQuestionnaire(donorData, sendProgress);

    req.on("close", () => {
        console.log("Client closed connection");
        res.end();
    });
}
