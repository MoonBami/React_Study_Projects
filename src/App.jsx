import { useState, useEffect, use } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios'
import './App.css'

function App() {
  const [cart, setCart] = useState([]) // 장바구니
  const [result, setResult] = useState(0) // 총 합계
  const [apiError, setApiError] = useState(null) // API 에러
  const [productList, setProductList] = useState([]) // 상품 목록

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://fakestoreapi.com/products')
      setProductList(res.data)
    } catch (err) {
      console.log("API 에러:", err)
      setApiError(err)
    }
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home productList={productList} addToCart={addToCart} cart={cart}/>} />
          <Route path="/cart" element={<CartComponent cart={cart} setCart={setCart} result={result} setResult={setResult} />} />
        </Routes>
      </Router>
    </div>
  )
}
const Home = ({productList, addToCart,cart}) => {
  const nav = useNavigate();
  const gotoCart = () => {
    // Navigate to cart page
    nav('/cart')
  }

  return (
    <div>
      <div className="title">
        <h1>쇼핑몰</h1>
        <button onClick={gotoCart}>장바구니 ({cart.length})</button>
      </div>
      <div className="product-list">
        {productList.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} width={50} />
            <h3 title={product.title}>{product.title}</h3>
            <p className="price">${product.price}</p>
            <button onClick={() => { addToCart(product) }}>담기</button>
          </div>
        ))}
      </div>
    </div>
  )
}


const CartComponent = ({ cart, setCart ,result,setResult}) => {
  const nav = useNavigate();
  const gotoCart = () => {
    // Navigate to home page
    nav('/')
  }

  return (
    <div className="cart">
      <div className='title'>
        <h1>장바구니</h1>
        <button onClick={gotoCart}>쇼핑 계속하기</button>
      </div>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>장바구니가 비어있습니다.</p>
        </div>
      ) : (
        <div className="cart-content">
          <div>
            <h2>총 합계: ${cart.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</h2>
          </div>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} width={50} height={50} />
              <p>{item.price} 달러</p>
              <button onClick={() => {
                setCart(prevCart => prevCart.filter(i => i.id !== item.id))
              }}>삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
