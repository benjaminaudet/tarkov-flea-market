import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export interface UseGetItemsQueryType {
  name: string
}

export const GET_ITEM_HISTORICAL_PRICES_BY_ID = gql`
  query getItemHistoricalPricesByIdQuery($id: ID) {
    item(lang: en, id: $id) {
      name
      gridImageLink
      historicalPrices {
        timestamp
        price
      }
    }
  }
`

export function useGetItemsQuery(lang: string = 'en') {
  const { result, loading, error } = useQuery<UseGetItemsQueryType>(gql`
  query getItemsQuery {
    items(lang: ${lang}) {
      id
      name
      basePrice
      gridImageLink
      wikiLink
      avg24hPrice
      sellFor {
        vendor {
          name
        }
        currency
        price
        priceRUB
      }
      buyFor {
        vendor {
          name
        }
        currency
        priceRUB
        price
      }
      fleaMarketFee
      changeLast48h
    }
  }
`, {'lang': lang})

  return { result, loading, error }
}

export function useGetItemHistoricalPricesQuery() {
  const { result, load } = useLazyQuery<UseGetItemsQueryType>(GET_ITEM_HISTORICAL_PRICES_BY_ID)

  return { resultHistoricalPrices: result, load }
}

