import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { BOOKS_BY_GENRE } from '../queries'

const Recommendations = ({ show, genre }) => {
  const [books, setBooks] = useState([])

  const { data: booksData } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !show,
  })

  useEffect(() => {
    if (booksData) {
      setBooks(booksData.allBooks)
    }
  }, [booksData])

  if (!show) {
    return null
  }

  return (
    <div>
      <h3>Recommendations</h3>
      <p>books in your favorite genre <strong>{genre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b, i) => (
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations