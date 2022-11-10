import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
      id
    }
    published
    genres
  }
`

export const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
    favoriteGenre
  }
`