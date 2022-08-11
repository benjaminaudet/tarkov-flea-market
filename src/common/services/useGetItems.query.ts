import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export interface UseGetItemsQueryType {
  name: string
}

export const GET_ITEMS_QUERY = gql`
  query getItems {
    items(lang: fr) {
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
`

export const GET_ITEM_HISTORICAL_PRICES = gql`
  query getItemHistoricalPrices($id: ID) {
    item(lang: fr, id: $id) {
      name
      historicalPrices {
        timestamp
        price
      }
    }
  }
`

export function useGetItemsQuery() {
  const { result, loading, error } = useQuery<UseGetItemsQueryType>(GET_ITEMS_QUERY)

  return { result, loading, error }
}

export function useGetItemHistoricalPricesQuery() {
  const { result, load } = useLazyQuery<UseGetItemsQueryType>(GET_ITEM_HISTORICAL_PRICES)

  return { resultHistoricalPrices: result, load }
}

