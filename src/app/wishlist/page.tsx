"use client";
import React, { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import FlatCard from "@/components/mini/FlatCard"; // Adjust the import path as necessary
import Navbar from "@/components/global/Navbar";

const WishlistPage: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.userAuthData) {
    return (
      <div className="text-center p-10 text-lg">
        Please log in to view your wishlist.
      </div>
    );
  }

  const wishlist = userContext.wishlist;

  // Convert wishlist object to an array of values and filter out any invalid or empty entries
  const wishlistItems = Object.values(wishlist).filter(
    (item) => item && item.id
  );

  return (
    <div>
      <Navbar />
      <div className="p-5 mx-auto bg-cyan-200 min-w-screen min-h-screen pt-20">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Your Wishlist
        </h1>
        {wishlistItems.length === 0 ? (
          <p className="text-lg text-center">
            Your wishlist is empty. Explore more apartments and add them to your
            wishlist!
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {wishlistItems.map((apartment) => (
              <FlatCard
                key={apartment.id}
                id={apartment.id}
                title={apartment.title}
                description={apartment.description}
                location={apartment.location}
                price={apartment.price}
                image={apartment.image}
                flexProp={apartment.flexProp}
                category={apartment.category}
                averageRating={apartment.averageRating}
                contactNo={apartment.contactNo}
                furnitureDescription={apartment.furnitureDescription}
                parking={apartment.parking}
                electricity={apartment.electricity}
                facility={apartment.facility}
                availableFor={apartment.availableFor}
                furniture={apartment.furniture}
                client={apartment.client}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
