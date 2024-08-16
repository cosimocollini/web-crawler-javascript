import fs from 'node:fs';

const printReport = (pages) => {
    console.log('\n📄 Report starting ... \n');
    const sortable = Object.fromEntries(
        Object.entries(pages).sort(([, a], [, b]) => a - b)
    );
    for (const element of Object.keys(sortable)) {
        console.log(`Found ${sortable[element]} internal links to ${element}`);
    }

};

const createCSVReport = (pages, outputPath) => {
    const csvRows = [['URL', 'Visit Count']];

    for (const [url, count] of Object.entries(pages)) {
        csvRows.push([url, count]);
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    fs.writeFileSync(outputPath, csvContent, 'utf8');

    console.log(`\n💾 CSV file saved to ${outputPath}`);
};

export { printReport, createCSVReport };