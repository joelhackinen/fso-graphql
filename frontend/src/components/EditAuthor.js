import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const EditAuthor = (props) => {
  const [authors, setAuthors] = useState([])
  const [selected, setSelected] = useState('')
  const [born, setBorn] = useState('')

  const { data } = useQuery(ALL_AUTHORS, {
    skip: !props.show,
  })

  useEffect(() => {
    if (data) {
      setAuthors(data.allAuthors)
      setSelected(data.allAuthors.length > 0 ? data.allAuthors[0].name : '')
    }
  }, [data])

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    update: (cache, response) => {
      cache.updateQuery(
        { query: ALL_AUTHORS },
        ({ allAuthors }) => {
          const editedAuthor = response.data.editAuthor
          return {
            allAuthors: allAuthors.map(a => a.name === editedAuthor.name
              ? a = ({ ...editedAuthor, bookCount: a.bookCount })
              : a
            )
          }
        }
      )
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: selected, born: born } })
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
        author
          <select value={selected} onChange={(event) => setSelected(event.target.value)}>
            {authors.map((a, i) => <option key={i} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input type='number' value={born} onChange={(event) => setBorn(event.target.valueAsNumber)}/>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default EditAuthor