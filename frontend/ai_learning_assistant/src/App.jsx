import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import { Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import DocumentsListPage from './pages/DocumentsListPage'
import DocumentsDetailPage from './pages/DocumentsDetailPage'
import FlashcardsListPage from './pages/FlashcardsListPage'
import FlashcardsDetailPage from './pages/FlashcardsDetailPage'
import QuizTakePage from './pages/QuizTakePage'
import QuizResultsPage from './pages/QuizResultsPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './componenets/auth/ProtectedRoute'      



const App = () => {
 const isAuthenticated = false; 
 const loading = false; 

 if (loading) {
   return <div className='flex items-center justify-center h-screen'>Loading...</div>;
 }

 return (
   <Router>
     <Routes>
       <Route path="/" 
       element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />

        {/* Protected routes */}
        <Route element ={<ProtectedRoute/>}> 
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path ="/documents" element={<DocumentsListPage/>} />
        <Route path ="/documents/:id" element={<DocumentsDetailPage/>} />
        <Route path ="/flashcards" element={<FlashcardsListPage/>} />
        <Route path ="/documents/:id/flashcards" element={<FlashcardsDetailPage/>} />
        <Route path ="/quizzes/:quizId" element={<QuizTakePage/>} />
        <Route path ="/quizzes/:quizId/results" element={<QuizResultsPage/>} />
        <Route path ="/profile" element={<ProfilePage/>} />
         </Route>



        <Route path="*" element={<NotFoundPage/>} />
     </Routes>
   </Router>
 )
}
export default App