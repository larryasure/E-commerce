import React from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Link } from 'react-router-dom'

export default function WishList() {
  const { addCart } = useCart()
  const {wishLists, removeItem}= useWishlist()


if (wishLists.length === 0 ) {
  return (
    <div className='min-h-screen py-12 mt-10 '>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-[#13315c] my-8'>My Wishlists</h1>
          
        
      </div>
    </div>
  )
}

  return (
    <div>WishList</div>
  )
}
