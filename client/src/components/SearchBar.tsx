import { algoliasearch } from "algoliasearch";
import { InstantSearch, Configure } from "react-instantsearch";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { DebouncedSearchBox } from "./search/DebouncedSearchBox";
import { InfiniteHitsList } from "./search/InfiniteHitsList";

const algoliaAppId = import.meta.env.VITE_ALGOLIA_APP_ID;
const algoliaSearchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const indexName = "posts_newest";

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);

export default function SearchBar() {
  useDocumentTitle("Explore / Birb");

  return (
    <div className="w-full">
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <Configure
          hitsPerPage={10}
          attributesToHighlight={["title", "text", "content", "author"]}
        />

        <div className="max-w-2xl mx-auto mb-3 sticky top-[105px] z-10 bg-background/95 backdrop-blur-sm">
          <DebouncedSearchBox />
        </div>

        <InfiniteHitsList />
      </InstantSearch>
    </div>
  );
}
