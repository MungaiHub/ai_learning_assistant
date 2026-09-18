import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import { Navigate } from 'react-router-dom'
import DashboardPage from './pages/Dashboard/DashboardPage'
import DocumentsListPage from './pages/Documents/DocumentListPage'
import DocumentsDetailPage from './pages/Documents/DocumentDetailPage'
import FlashcardsListPage from './pages/Flashcards/FlashcardListPage'
import FlashcardsDetailPage from './pages/Flashcards/FlashcardPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultsPage from './pages/Quizzes/QuizResultPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ProtectedRoute from './componenets/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'      



const App = () => {
  
  const { isAuthenticated, loading } = useAuth();

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