import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { CREATE_USER } from '../queries'

const UserForm = ({ show, setPage }) => {
  const [username, setUsername] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const [password, setPassword] = useState('')
  const [createUser] = useMutation(CREATE_USER)

  const handleSubmit = (event) => {
    event.preventDefault()
    createUser({ variables: {username, password, favoriteGenre }})
    setPage()
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h4>Create user</h4>
      <form onSubmit={handleSubmit}>
        <div>
          username <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          favorite genre <input value={favoriteGenre} onChange={(event) => setFavoriteGenre(event.target.value)}/>
        </div>
        <div>
          password <input password={password} type='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <button type='submit'>sign up</button>
      </form>
    </div>
  )
}

export default UserForm