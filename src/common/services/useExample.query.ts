import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export interface UseGetItemsQueryType {
  name: string
}

export function useGetItemsQuery() {
  const { result, loading, error } = useQuery<UseGetItemsQueryType>(gql`
  query getItems {
    items(lang: en) {
      id
      name
      shortName
      basePrice
      iconLink
      iconLinkFallback
      wikiLink
      avg24hPrice
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
