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
    update: (cache, response) => {
      cache.updateQuery(
        { query: BOOKS_BY_GENRE, variables: { genre: favoriteGenre }},
        ({ allBooks }) => {
          const addedBookGenres = response.data.addBook.genres
          return { 
            allBooks: addedBookGenres.includes(favoriteGenre)
              ? allBooks.concat(response.data.addBook)
              : allBooks
          }
        }
      )
      cache.updateQuery(
        { query: ALL_BOOKS },
        ({ allBooks }) => {
          return { allBooks: allBooks.concat(response.data.addBook) }
        }
      )
      cache.updateQuery(
        { query: ALL_AUTHORS },
        ({ allAuthors }) => {
          const addedBookAuthor = response.data.addBook.author
          const isExistingAuthor = allAuthors.map(a => a.name).includes(addedBookAuthor.name)
          return {
            allAuthors: isExistingAuthor
              ? allAuthors
              : allAuthors.concat(addedBookAuthor)
          }
        }
      )
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