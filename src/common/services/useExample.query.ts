import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export interface UseExampleQueryType {
  name: string
}

export function useExampleQuery() {
  const { result, loading, error } = useQuery<UseExampleQueryType>(gql`
  query getItems {
    items(lang: en) {
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
