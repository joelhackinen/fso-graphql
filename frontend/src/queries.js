import { gql } from '@apollo/client'
import { BOOK_DETAILS, USER_DETAILS } from './fragments'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOKS_BY_GENRE = gql`
  query genreBooks($genre: String!) {
    allBooks(
      genre: $genre
    ){
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const GET_USER = gql`
  query {
    me {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ){
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation edit($name: String!, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const CREATE_USER = gql`
  mutation addUser(
    $username: String!
    $favoriteGenre: String!
  ) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
  ${BOOK_DETAILS}
`