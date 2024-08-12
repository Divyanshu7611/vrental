import { useState } from "react";
import axios from "axios";

interface StarRatingProps {
  apartmentId: any;
  userId: any;
}

const StarRating: React.FC<StarRatingProps> = ({ apartmentId, userId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = async (value: number) => {
    setRating(value);
    setLoading(true);
    setError(null);

    try {
      await axios.post(`/api/aparment/rating?id=${apartmentId}`, {
        user: userId,
        rating: value,
      });
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating", error);
      setError("Rating Already Exist");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starClass =
        i <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-400";
      stars.push(
        <svg
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          className={`w-6 h-6 cursor-pointer ${starClass}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l4.54 4.73L5.82 21z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-2">{renderStars()}</div>
      {loading && <p className="text-gray-500">Submitting...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default StarRating;
