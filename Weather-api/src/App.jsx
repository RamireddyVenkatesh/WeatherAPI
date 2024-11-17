// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weather from './Weather'
import './index.css'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Weather />}></Route>
      </Routes>
    </Router>
  )
}

export default App
