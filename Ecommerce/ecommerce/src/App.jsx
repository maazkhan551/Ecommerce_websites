import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import SearchBar from './components/SearchBar'
import image1 from './assets/perfume1.jpeg'
import Home from './pages/Home'

function App() { 
const products = [
  { id: 1, title: "Running Shoes", price: 59, image: image1, category: "Footwear" },
  { id: 2, title: "Backpack", price: 45, image: "...", category: "Bags" },
];
  return (
    <>
       <Home/>
      
      
    </>
  )
}

export default App
