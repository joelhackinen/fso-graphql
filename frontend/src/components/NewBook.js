import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, BOOKS_BY_GENRE } from '../queries'

const NewBook = ({ show, favoriteGenre }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook } }) => {
      try { // might not be cached before calling this
        cache.updateQuery({ query: BOOKS_BY_GENRE, variables: { genre: favoriteGenre }}, ({ allBooks }) => ({ 
          allBooks: addBook.genres.includes(favoriteGenre)
            ? allBooks.concat(addBook)
            : allBooks
        }))
      } catch (e) {
        // no need to handle this. this query will be cached if/when needed
      }
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({  // will always be cached before calling
        allBooks: allBooks.concat(addBook)
      }))
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => ({  // will always be cached before calling
        allAuthors: allAuthors.map(a => a.name).includes(addBook.author.name)
          ? allAuthors.map(a => a.name === addBook.author.name ? a = { ...a, bookCount: a.bookCount + 1 } : a)
          : allAuthors.concat({ ...addBook.author, bookCount: 1 })
      }))
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook