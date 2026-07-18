// import { useEffect, useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import axiosInstance from "../api/axiosConfig";

// export default function WishList() {
//   const { isAuthenticated } = useContext(AuthContext);
//   const navigate = useNavigate();





//   if (wishlistItems.length === 0) {
//     return (
//       <div className="min-h-screen py-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-xl lg:text-2xl  font-bold text-[#13315C] my-8">My Wishlist</h1>
//           <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//             <div className="mb-6">
//               <svg
//                 className="w-24 h-24 mx-auto text-gray-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-600 text-lg mb-8">Your wishlist is empty</p>
//             <Link
//               to="/products"
//               className="inline-block bg-[#155daf] text-white px-8 py-4 rounded-lg hover:bg-[#13315C] transition-all duration-300 transform hover:scale-105 font-semibold"
//             >
//               Start Adding Items
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-12">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold text-[#13315C]">My Wishlist</h1>
//           <span className="text-sm text-gray-600 font-medium">
//             {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {wishlistItems.map((item, index) => (
//             <div
//               key={item.id}
//               className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-fadeInUp"
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               {/* Product Image */}
//               <div className="relative h-64 bg-gray-50 overflow-hidden">
//                 <img
//                   src={
//                     item.image
//                       ? `http://127.0.0.1:8000${item.image}`
//                       : `https://via.placeholder.com/400x300?text=${item.name}`
//                   }
//                   alt={item.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute top-4 right-4 bg-[#13315C] text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-md">
//                   ${item.price}
//                 </div>

//                 {/* Remove from Wishlist Button */}
//                 <button
//                   onClick={() => removeFromWishlist(item.id)}
//                   className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300 shadow-md"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Product Info */}
//               <div className="p-6 flex flex-col grow">
//                 <span className="text-xs text-[#155daf] font-bold tracking-wider uppercase mb-2 block">
//                   {item.category?.name || "Premium Line"}
//                 </span>
//                 <h3 className="text-lg font-bold text-[#13315C] mb-2 line-clamp-2 group-hover:text-[#155daf] transition-colors">
//                   {item.name}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed grow">
//                   {item.description ||
//                     "Premium quality product for discerning customers"}
//                 </p>

//                 <div className="space-y-3 pt-4 border-t border-gray-50">
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="w-full bg-[#155daf] hover:bg-[#13315C] text-white px-5 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
//                   >
//                     Add to Cart
//                   </button>
//                   <Link
//                     to={`/products/${item.id}`}
//                     className="block w-full text-center text-sm font-bold text-[#13315C] hover:text-[#155daf] transition-colors"
//                   >
//                     View Details →
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Continue Shopping */}
//         <div className="mt-12 text-center">
//           <Link
//             to="/products"
//             className="inline-block text-[#155daf] font-semibold hover:text-[#13315C] transition-colors"
//           >
//             Continue Browsing Products →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react'

export default function WishList() {
  return (
    <div>WishList</div>
  )
}
