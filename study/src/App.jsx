import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from './LoginPage.jsx'
import ChattingPage from './ChattingPage.jsx'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChattingPage/>} />
      </Routes>
    </Router>
  ) 
}


export default App
