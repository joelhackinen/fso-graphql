import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN)

  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password }})
    setPage()
  }

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('books-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  return (
    <div>
      <h4>Login!</h4>
      <form onSubmit={handleLogin}>
        <div>
          username <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          password <input value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm