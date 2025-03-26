/* ... */
import type { SearchClient } from "algoliasearch/lite";

import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";

import {
  INSTANT_SEARCH_QUERY_SUGGESTIONS
} from "./constants";

type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
  searchClient: SearchClient;
  className?: string;
};

export function Autocomplete({
  searchClient,
  className,
  ...autocompleteProps
}: AutocompleteProps) {
  /* ... */
  const plugins = useMemo(() => {
    /* ... */
    const querySuggestions = createQuerySuggestionsPlugin({
      searchClient,
      indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
      getSearchParams() {
        return recentSearches.data!.getAlgoliaSearchParams({
          hitsPerPage: 6
        });
      },
      transformSource({ source }) {
        return {
          ...source,
          sourceId: "querySuggestionsPlugin",
          onSelect({ item }) {
            setInstantSearchUiState({ query: item.query });
          },
          getItems(params) {
            if (!params.state.query) {
              return [];
            }

            return source.getItems(params);
          },
        };
      }
    });

    return [recentSearches, querySuggestions];
  }, []);