import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

export const GET_ITEM_CATEGORIES = (lang = 'en') => gql`
  query getItemsCategories {
    itemCategories(lang: ${lang}) {
      name
      normalizedName
      children {
        name
        normalizedName
      }
    }
  }
`

export const GET_ITEM_HISTORICAL_PRICES_BY_ID = gql`
  query getItemHistoricalPricesByIdQuery($id: ID) {
    item(lang: en, id: $id) {
      id
      name
      gridImageLink
      historicalPrices {
        timestamp
        price
      }
    }
  }
`

export const GET_ITEMS = (lang = 'en') => gql`
  query getItemsQuery {
    items(lang: ${lang}) {
      id
      name
      normalizedName
      basePrice
      category {
        name
        normalizedName
        parent {
          name
          normalizedName
        }
      }
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

export function useGetItemsQuery(lang = 'en') {
  const { result, loading, error } = useQuery(GET_ITEMS(lang), { lang }, {fetchPolicy: 'cache-first'})

  return { result, loading, error }
}

export function useGetItemHistoricalPricesQuery(lang = 'en') {
  const { result, load } = useLazyQuery(GET_ITEM_HISTORICAL_PRICES_BY_ID)

  return { resultHistoricalPrices: result, load }
}

export function useGetItemsCategoriesQuery(lang) {
  const { result } = useQuery(GET_ITEM_CATEGORIES(lang))

  return { resultItemsCategories: result }
}
