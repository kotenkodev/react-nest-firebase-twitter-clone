import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox } from "react-instantsearch";

const algoliaAppId = import.meta.env.VITE_ALGOLIA_APP_ID;
const algoliaSearchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);

export default function SearchBar() {
  return (
    <InstantSearch searchClient={searchClient} indexName="PostsSearch">
      <SearchBox />
    </InstantSearch>
  );
}
