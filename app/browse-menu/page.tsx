const BrowseMenuPage = async ({searchParams,}:{searchParams:Promise<{[key:string]:string | string[] | undefined}>}) => {

    const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>)
    const query = urlSearch.toString()
    console.log('search params',query)
    return (
        <div>
            BrowseMenuPage
        </div>
    );
};

export default BrowseMenuPage;