import process from 'node:process';

import { crawlPage } from "./crawl.js";
import { printReport, createCSVReport } from "./report.js";

const main = async () => {
    if (process.argv.length !== 3) {
        throw new Error("Command need 1 argument");
    }

    const pages = await crawlPage(process.argv[2]);

    //print report in console
    //printReport(pages);

    createCSVReport(pages, './report.csv');
};

main();