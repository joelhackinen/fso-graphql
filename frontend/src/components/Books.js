import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const { data } = useQuery(ALL_BOOKS, {
    skip: !props.show,
  })

  useEffect(() => {
    if (data) {
      setBooks(data.allBooks)
    }
  }, [data])

  if (!props.show) {
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

export default Books