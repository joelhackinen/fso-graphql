import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState('')
  const [booksToShow, setBooksToShow] = useState([])

  const { data: bookData } = useQuery(genre === '' ? ALL_BOOKS : BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !show
  })

  useEffect(() =>{
    if (bookData) {
      setBooksToShow(bookData.allBooks)
    }
  }, [bookData])

  const allGenres = [ ...new Set(books.reduce((a, b) => a.concat(b.genres), []))]

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b, i) => (
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map((g, i) => <button onClick={() => setGenre(g)} key={i}>{g}</button>)}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  )
}

export default Books