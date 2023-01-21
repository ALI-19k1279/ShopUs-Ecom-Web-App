import React, { useContext,useState } from 'react';
import Link from 'next/link';
import { AiOutlineShopping ,AiOutlineLogin} from 'react-icons/ai'
import { Cart } from '.';
import {Form} from '.'
import {Login} from '.'
import { useStateContext} from '../context/StateContext';
import { Store } from '../utils/Store';
import classes from '../utils/classes';
import router from 'next/router';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';

const Navbar = () => {
  const { showCart, setShowCart,user, totalQuantities,state,dispatch } = useStateContext();
  const {userInfo}=state;
  const router=useRouter()
  const { redirect } = router.query;
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const loginMenuCloseHandler = (e,redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    jsCookie.remove('userInfo');
    jsCookie.remove('cartItems');
    jsCookie.remove('shippingAddress');
    jsCookie.remove('paymentMethod');
    router.push('/');
  };
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">ShopUS</Link>
      </p>

      <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
      {showCart && <Cart />}
      <div className="login-icon">
        {
          userInfo? (
            <>
                  <Button
                  id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={classes.navbarButton}
                    className='login-icon'
                    onClick={loginClickHandler}
                  >
                   Hi, {userInfo.name}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                   
                  >
                    {/* <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e,'/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e,'/order-history')
                      }
                    >
                      Order History 
                    </MenuItem> */}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
          ):
          (
            <Link href="/Login">
               <AiOutlineLogin/>
            </Link>
          )
        }
        
      </div>
      
    </div>
  )
}


export default Navbar