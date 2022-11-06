import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const { data } = useQuery(ALL_AUTHORS, {
    skip: !props.show,
  })

  useEffect(() => {
    if (data) {
      setAuthors(data.allAuthors)
    }
  }, [data])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ? a.born : null}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors