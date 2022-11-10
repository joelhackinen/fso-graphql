import { useEffect, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import EditAuthor from './components/EditAuthor'
import LoginForm from './components/LoginForm'
import UserForm from './components/UserForm'
import Recommendations from './components/Recommendations'
import { GET_USER, ALL_BOOKS } from './queries'

const App = () => {
  const [favGenre, setFavGenre] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [books, setBooks] = useState([])
  const client = useApolloClient()

  const { data: userData } = useQuery(GET_USER, {
    skip: !token,
  })

  const { data: booksData } = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (booksData) {
      setBooks(booksData.allBooks)
    }
  }, [booksData])

  useEffect(() => {
    const token = localStorage.getItem('books-user-token')
    setToken(token)
  }, [])

  useEffect(() => {
    if (userData) {
      setFavGenre(userData.me.favoriteGenre)
    }
  }, [userData])

  const logout = () => {
    setToken(null)
    setFavGenre(null)
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

      <NewBook show={page === 'add'} favoriteGenre={favGenre} />

      <EditAuthor show={page === 'editAuthor'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={() => setPage('authors')} />

      <UserForm show={page === 'signUp'} setPage={() => setPage('login')}/>

      <Recommendations show={page === 'recommended'} genre={favGenre} />
    </div>
  )
}

export default App