import { useEffect, useState } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import EditAuthor from './components/EditAuthor'
import LoginForm from './components/LoginForm'
import UserForm from './components/UserForm'
import Recommendations from './components/Recommendations'
import { ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE, BOOK_ADDED } from './queries'

export const updateBooksCache = (cache, added) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(added)),
    }
  })

  added.genres.forEach(g => {
    try { // update query for each genre only if query already exists for that specific genre
      cache.updateQuery({ query: BOOKS_BY_GENRE, variables: { genre: g }}, ({ allBooks }) => { 
        return {
          allBooks: uniqByTitle(allBooks.concat(added)),
        }
      })
    } catch (e) {
      // no need to handle this
    }
  })
}

const updateAuthorCache = (cache, added) => {
  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    return {
      allAuthors: allAuthors.map(a => a.name).includes(added.author.name)
        ? allAuthors.map(a => a.name === added.author.name ? a = { ...a, bookCount: a.bookCount + 1 } : a)
        : allAuthors.concat({ ...added.author, bookCount: 1 })
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [books, setBooks] = useState([])
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      window.alert("New book has been added")
      updateBooksCache(client.cache, data.data.bookAdded)
      updateAuthorCache(client.cache, data.data.bookAdded)
    }
  })

  const { data: booksData } = useQuery(ALL_BOOKS)
  useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (booksData) {
      setBooks(booksData.allBooks)
    }
  }, [booksData])

  useEffect(() => {
    const token = localStorage.getItem('books-user-token')
    setToken(token)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      {
        token
          ? <div>
              <button onClick={() => setPage('authors')}>authors</button>
              <button onClick={() => setPage('books')}>books</button>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('editAuthor')}>edit author</button>
              <button onClick={() => setPage('recommended')}>recommended</button>
              <button onClick={logout}>logout</button>
            </div>
          : <div>
              <button onClick={() => setPage('authors')}>authors</button>
              <button onClick={() => setPage('books')}>books</button>
              <button onClick={() => setPage('login')}>login</button>
              <button onClick={() => setPage('signUp')}>sign up</button>
            </div>
      }

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} books={books} />

      <NewBook show={page === 'add'} />

      <EditAuthor show={page === 'editAuthor'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={() => setPage('authors')} />

      <UserForm show={page === 'signUp'} setPage={() => setPage('login')} />

      <Recommendations show={page === 'recommended'} />
    </div>
  )
}

export default App