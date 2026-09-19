import {createContext, useContext, useState} from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('user')
		return storedUser ? JSON.parse(storedUser) : null
	})

	const logout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{user, logout}}>
			{children}
		</AuthContext.Provider>
	)
}
