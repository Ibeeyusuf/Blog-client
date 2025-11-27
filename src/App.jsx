import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import SinglePost from './components/blog/SinglePost';
import Signup from './components/auth/Signup';
import BlogList from './components/blog/BlogList';
import CreatePost from './components/blog/CreatePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<BlogList />} />
            <Route path="/post/:id" element={<SinglePost />} /> 
            <Route 
              path="/create-post" 
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;