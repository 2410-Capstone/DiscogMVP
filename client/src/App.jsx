import './styles/scss/App.scss';
import { Routes, Route } from 'react-router-dom';
import Home from './common/Home';
import Navbar from './common/Navbar';


function App() {
  return (
    <>
    <Navbar/>
    <main className ="app-container">
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/cart" element={<Cart />} /> */}
    </Routes>
    </main>
    </>
  );
}

export default App
