import MyWebsite from "./content-provider";

const provider = new MyWebsite();

async function main() {
    const pages = await provider.getPages();
    console.log(
        pages.routes.map(r => ({
            r: r.path,
            p: r.page,
            data: r.page.data
        }))
    );
}

main();
