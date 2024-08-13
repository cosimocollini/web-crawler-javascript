const printReport = (pages) => {
    console.log('Report starting ...');
    const sortable = Object.fromEntries(
        Object.entries(pages).sort(([, a], [, b]) => a - b)
    );
    for (const element of Object.keys(sortable)) {
        console.log(`Found ${sortable[element]} internal links to ${element}`);
    }

};

export { printReport };