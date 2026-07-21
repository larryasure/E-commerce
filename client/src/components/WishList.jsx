import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/formatCurrency";

export default function WishList() {
  const { addCart } = useCart();
  const { wishlists, removeItem } = useWishlist();

  if (wishlists.length === 0) {
    return (
      <div className="min-h-screen py-12 mt-10 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl md:text-2xl font-bold text-[#13315c] my-4">
            My Wishlists
          </h1>
          <div className="p-12 rounded-xl text-center  shadow-lg/10">
            <div className=" ">
              <svg
                className="w-24 h-24 mx-auto text-red-200"
                fill="#ef4544"
                stroke="currentColor"
                viewBox="0 0 24 28"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <p className="font-medium text-[#155daf] text-lg mb-4 ">
              Your Wishlist is empty
            </p>

            <Link className="inline-block bg-[#155daf] text-white px-4 py-2.5 rounded-lg hover:bg-[#13315C] transition-all duration-300 transform hover:scale-105 font-semibold">
              Start Adding Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-14 my-8 min-h-screen">
        <div className="max-w-6xl  w-full mx-auto  ">
          <div className="border-b border-gray-200 pb-1 my-4">
            <div className="items-center justify-between flex ">
              <h1 className="text-xl md:text-2xl font-bold text-[#13315c]">
                My Wishlists
              </h1>

              <div className="text-lg font-medium tracking-wider  ">
                {wishlists.length !== 1 ? "Wishlists" : "Wishlist"} (
                {wishlists.length})
              </div>
            </div>
          </div>

          <div className="my-4  bg-white  shadow-sm p-6 rounded-xl">
            {wishlists.map((wishlistItem) => {
              const item = wishlistItem.product;
              return (
                <div
                  key={item.id}
                  className="border border-gray-400 p-4 rounded-lg  shadow-sm my-4"
                >
                  <div className="flex item-start gap-4">
                    <div className="overflow-hidden h-32 w-32">
                      <Link to={`/products/${item.id}`}>
                        <img
                          className="w-full h-full rounded-md object-cover transition-transform duration-500 hover:scale-105 "
                          src={item.image}
                          alt={item.name}
                        />
                      </Link>
                    </div>

                    <div className="flex flex-col flex-1 min-h-26">
                      <div>
                        <Link to={`/products/${item.id}`}>
                          <p className="text-[#13315c] text-lg font-medium hover:text-[#155daf] transition-all duration-300 ">
                            {item.name}
                          </p>
                        </Link>

                        <p className="text-sm tracking-wider text-gray-400">
                          {item.category?.name}
                        </p>

                        <p className="font-medium mt-2">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="mt-auto flex justify-end gap-4 items-center  pt-4">
                        <button
                          onClick={() => removeItem(wishlistItem.id)}
                          className="text-red-500 hover:bg-red-200 p-1.5 rounded-lg font-medium cursor-pointer"
                        >
                          Remove
                        </button>

                        <button
                          onClick={() => addCart(item)}
                          className="bg-[#155daf] text-white text-sm px-3 py-2 font-medium  cursor-pointer rounded-lg hover:bg-[#13315c] transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
