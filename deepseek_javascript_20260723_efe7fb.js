import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ========== STYLES ==========
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  productCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    minHeight: '80px',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    margin: '0 auto'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  reviewCard: {
    borderBottom: '1px solid #eee',
    padding: '10px 0'
  },
  stars: {
    color: '#ffc107',
    fontSize: '20px'
  }
};

// ========== MAIN APP ==========
function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', isCustomizable: false, images: ['']
  });
  const [reviewForm, setReviewForm] = useState({ productId: '', rating: 5, comment: '', images: [''] });

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      if (userData) setUser(userData);
    }
    fetchProducts();
  }, [token]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
      alert('✅ Login successful!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Login failed'));
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      setShowRegister(false);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      alert('✅ Registration successful!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Registration failed'));
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setCart([]);
    alert('Logged out successfully');
  };

  // Add to cart
  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    alert(`✅ ${product.name} added to cart!`);
  };

  // Remove from cart
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Place Order
  const placeOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      setShowLogin(true);
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        products: cart.map(p => ({
          productId: p._id,
          quantity: p.quantity || 1
        })),
        shippingAddress: {
          name: user.name,
          phone: '9876543210',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        },
        paymentMethod: 'COD'
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      alert(`✅ Order placed successfully! Order ID: ${response.data._id}`);
      setCart([]);
      fetchOrders();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to place order'));
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await axios.get('http://localhost:5000/api/orders/myorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Add product (Admin)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/products', {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      });
      alert('✅ Product added successfully!');
      setShowProductForm(false);
      setProductForm({ name: '', description: '', price: '', category: '', stock: '', isCustomizable: false, images: [''] });
      fetchProducts();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to add product'));
    }
  };

  // Delete product (Admin)
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert('✅ Product deleted!');
      fetchProducts();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to delete product'));
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to review');
      setShowLogin(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        productId: reviewForm.productId,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
        images: reviewForm.images
      });
      alert('✅ Review submitted!');
      setReviewForm({ productId: '', rating: 5, comment: '', images: [''] });
      fetchReviews(reviewForm.productId);
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to submit review'));
    }
  };

  // Fetch reviews
  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${productId}`);
      setReviews({ ...reviews, [productId]: response.data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // View product details
  const viewProduct = async (product) => {
    setSelectedProduct(product);
    if (!reviews[product._id]) {
      await fetchReviews(product._id);
    }
  };

  return (
    <div style={styles.container}>
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <h1>🛍️ E-Commerce Store</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>🛒 {cart.length} items</span>
          {user ? (
            <>
              <span>👋 {user.name} {user.isAdmin && '⭐'}</span>
              <button style={styles.button} onClick={() => { setShowOrderHistory(true); fetchOrders(); }}>
                Orders
              </button>
              {user.isAdmin && (
                <button style={styles.button} onClick={() => setShowAdmin(!showAdmin)}>
                  Admin Panel
                </button>
              )}
              <button style={styles.buttonDanger} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button style={styles.button} onClick={() => setShowLogin(true)}>Login</button>
              <button style={styles.button} onClick={() => setShowRegister(true)}>Register</button>
            </>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Products Section */}
        <div style={{ flex: '3', minWidth: '300px' }}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <h2>Products</h2>
              {user?.isAdmin && (
                <button style={styles.button} onClick={() => setShowProductForm(true)}>
                  ➕ Add Product
                </button>
              )}
            </div>
            
            <div style={styles.grid}>
              {products.map(product => (
                <div key={product._id} style={styles.productCard} onClick={() => viewProduct(product)}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/200x150?text=Product'}
                    alt={product.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <h4>{product.name}</h4>
                  <p style={{ fontSize: '18px', color: '#1976d2', fontWeight: 'bold' }}>₹{product.price}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{product.description.substring(0, 60)}...</p>
                  {product.isCustomizable && (
                    <span style={{ backgroundColor: '#ff9800', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      🎨 Customizable
                    </span>
                  )}
                  <div style={{ marginTop: '10px' }}>
                    <button style={styles.button} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                      Add to Cart
                    </button>
                    {user?.isAdmin && (
                      <button 
                        style={{ ...styles.buttonDanger, marginLeft: '5px', padding: '5px 10px', fontSize: '12px' }}
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product._id); }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No products found. {user?.isAdmin ? 'Click "Add Product" to get started!' : 'Check back later!'}
              </p>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={styles.card}>
            <h3>🛒 Cart ({cart.length})</h3>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
                <button style={{ ...styles.buttonDanger, padding: '2px 8px', fontSize: '12px' }} onClick={() => removeFromCart(index)}>×</button>
              </div>
            ))}
            {cart.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <p><strong>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</strong></p>
                <button style={{ ...styles.button, width: '100%' }} onClick={placeOrder}>
                  Place Order (COD)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== LOGIN MODAL ===== */}
      {showLogin && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={styles.input} required />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={styles.input} required />
              <button type="submit" style={styles.button}>Login</button>
              <button type="button" style={{ ...styles.buttonDanger }} onClick={() => setShowLogin(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== REGISTER MODAL ===== */}
      {showRegister && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={styles.form}>
              <input type="text" placeholder="Name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} style={styles.input} required />
              <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} style={styles.input} required />
              <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} style={styles.input} required />
              <button type="submit" style={styles.button}>Register</button>
              <button type="button" style={{ ...styles.buttonDanger }} onClick={() => setShowRegister(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD PRODUCT MODAL ===== */}
      {showProductForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct} style={styles.form}>
              <input type="text" placeholder="Product Name" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} style={styles.input} required />
              <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} style={styles.textarea} required />
              <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} style={styles.input} required />
              <input type="text" placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} style={styles.input} required />
              <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} style={styles.input} />
              <button type="submit" style={styles.button}>Add Product</button>