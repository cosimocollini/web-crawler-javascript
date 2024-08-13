import process from 'node:process';

import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

const main = async () => {
    if (process.argv.length !== 3) {
        throw new Error("Command need 1 argument");
        process.disconnect();
    }

    const pages = await crawlPage(process.argv[2]);
    printReport(pages);
};

main();