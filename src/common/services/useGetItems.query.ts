import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export interface UseGetItemsQueryType {
  name: string
}

export function useGetItemsQuery() {
  const { result, loading, error } = useQuery<UseGetItemsQueryType>(gql`
  query getItems {
    items(lang: fr) {
      id
      name
      shortName
      basePrice
      gridImageLink
      gridImageLinkFallback
      wikiLink
      avg24hPrice
      sellFor {
        vendor {
          name
        }
        priceRUB
      }
      fleaMarketFee
      low24hPrice
      high24hPrice
      changeLast48h
      changeLast48hPercent
    }
  }
 `)

  return { result, loading, error }
}
