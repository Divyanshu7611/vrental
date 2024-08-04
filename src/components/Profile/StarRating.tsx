import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex gap-3">
      {Array.from({ length: maxRating }, (_, index) => (
        <FaStar
          key={index}
          color={index < rating ? "#ffc107" : "#e4e5e9"}
          className="text-3xl"
        />
      ))}
    </div>
  );
};

export default StarRating;
