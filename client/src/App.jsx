import 'remixicon/fonts/remixicon.css'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import 'animate.css';
import AdminProducts from './components/Admin/Products'
import Orders from './components/Admin/Orders'
import Dashboard from './components/Admin/Dashboard'
import Customers from './components/Admin/Customers'
import Payments from './components/Admin/Payments'
import Settings from './components/Admin/Settings'
import NotFound from './components/NotFound'
import Admin from './components/Admin'
import Home from './components/Home'
import Category from './components/Category'
import Cart from './components/Cart';
import Profile from './components/Profile';
import Login from './components/Login'
import Signup from './components/Signup'
import Contact from './components/Contact';
import PreGuard from './components/Guard/PreGuard';
import AdminGuard from './components/Guard/AdminGuard';
import Failed from './components/Failed';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home slider />} />
        <Route path='/products' element={<Home slider={false} title="All Products" />} />
        <Route path='/category' element={<Category />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route element={<PreGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path='/contact-us' element={<Contact />} />
        <Route element={<AdminGuard />}>
          <Route path='/admin'>
            <Route path='products' element={<AdminProducts />} />
            <Route path='orders' element={<Orders />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='payments' element={<Payments />} />
            <Route path='customers' element={<Customers />} />
            <Route path='settings' element={<Settings />} />
            <Route path='auth' element={<Admin />} />
          </Route>
        </Route>
        <Route path='/failed' element={<Failed />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App