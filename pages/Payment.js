import React,{useRef} from 'react'
import toast from 'react-hot-toast'
import getStripe from '../lib/getStripe';
import { useStateContext } from '../context/StateContext'
import router from 'next/router'
import { urlFor } from '../lib/client'

const Payment = () => {
    const cartRef=useRef();
    const {cartItems}=useStateContext();
    const handleCheckout = async () => {
        const stripe = await getStripe();
        console.log(cartItems)
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItems),
        });
    
        if(response.statusCode === 500) return;
        
        const data = await response.json();
    
        toast.loading('Redirecting...');
    
        stripe.redirectToCheckout({ sessionId: data.id });
      }
  return (
    <div>
    {handleCheckout}
    </div>
  )
}

export default Payment