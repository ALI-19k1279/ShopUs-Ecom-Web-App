import React,{createContext,useContext,useState,
useEffect,useReducer} from "react";
import {toast} from 'react-hot-toast';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

const Context=createContext();
const initialState = {
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._key === newItem._key
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._key === existItem._key ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._key !== action.payload._key
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
      case 'SAVE_SHIPPING_ADDRESS':
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress: action.payload,
          },
        };
      case 'SAVE_PAYMENT_METHOD':
        return {
          ...state,
          cart: {
            ...state.cart,
            paymentMethod: action.payload,
          },
        };
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
        },
      };
    default:
      return state;
  }
}
export const StateContext=({children})=>{
    const [showCart,setShowCart]=useState(false)
    const [user, setUser] = useState(null);
    const [showLogin,setShowLogin]=useState(false)
    const [cartItems,setCartItems]=useState([])
    const [totalPrice,setTotalPrice]=useState(0)
    const [totalQuantities,setTotalQuantities]=useState(0)
    const [qty,setQty]=useState(1)
    const router=useRouter()
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    let foundProduct;
    let index;
    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
        
        if(checkProductInCart) {
          const updatedCartItems = cartItems.map((cartProduct) => {
            if(cartProduct._id === product._id) return {
              ...cartProduct,
              quantity: cartProduct.quantity + quantity
            }
          })
    
          setCartItems(updatedCartItems);
        } else {
          product.quantity = quantity;
          
          setCartItems([...cartItems, { ...product }]);
        }
    
        toast.success(`${qty} ${product.name} added to the cart.`);
      } 
      const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);
    
        setTotalPrice((prevTotalPrice) => prevTotalPrice -foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
      }
    
      const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id)
    
        if(value === 'inc') {
          setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 } ]);
          setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
          setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec') {
          if (foundProduct.quantity > 1) {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 } ]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
          }
        }
      }
      const incQty = () => {
        setQty((prevQty) => prevQty + 1);
      }
    
      const decQty = () => {
        setQty((prevQty) => {
          if(prevQty - 1 < 1) return 1;
         
          return prevQty - 1;
        });
      }
      /**
   * Log the user in
   * @param {string} email 
   */
  const loginUser = async (email) => {
    try {
      await magic.auth.loginWithMagicLink({ email });
      setUser({ email });
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * Log the user out
   */
   const logoutUser = async () => {
    try {
      await magic.user.logout();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * If user is logged in, get data and display it
   */
   const checkUserLoggedIn = async () => {
    try {
        const isLoggedIn = await magic.user.isLoggedIn();

        if (isLoggedIn) {
            const { email } = await magic.user.getMetadata();
            setUser({ email });
            //Add this just for test
            const token = await getToken()
            console.log("checkUserLoggedIn token", token)
        }
    } catch (err) {
        console.log(err);
    }
  };
    return(
        <Context.Provider
        value={{
            showCart,
            setShowCart,
            setShowLogin,
            showLogin,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuanitity,
            onRemove,
            setCartItems,
        setTotalPrice,
        setTotalQuantities,
        user,
        loginUser,
        logoutUser,
        value,
        state,
        dispatch
          }}>
            {children}
        </Context.Provider>
    )

}
export const useStateContext = () => useContext(Context);