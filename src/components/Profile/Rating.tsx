import { useState } from "react";
import axios from "axios";

interface StarRatingProps {
  apartmentId: string | null | undefined;
  userId: string | null | undefined;
  onRated?: (averageRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ apartmentId, userId, onRated }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = !apartmentId || !userId;

  const handleMouseEnter = (value: number) => {
    if (disabled || loading) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = async (value: number) => {
    if (disabled || loading) return;
    setRating(value);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(`/api/aparment/rating?id=${apartmentId}`, {
        user: userId,
        rating: value,
      });
      if (res.data?.success) {
        setSuccess("Thanks — your rating was saved.");
        if (typeof res.data?.data?.averageRating === "number") {
          onRated?.(res.data.data.averageRating);
        }
      } else {
        setError(res.data?.message || "Could not save rating");
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string }; status?: number } };
      const msg =
        ax.response?.data?.message ||
        (ax.response?.status === 409 ? "You have already rated this listing." : null) ||
        "Could not submit rating. Try again.";
      setError(msg);
      console.error("Error submitting rating", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starClass =
        i <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-400";
      const dim = disabled || loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer";
      stars.push(
        <button
          type="button"
          key={i}
          disabled={disabled || loading}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          className={`p-0.5 bg-transparent border-0 ${dim}`}
          aria-label={`Rate ${i} out of 5`}
        >
          <svg
            className={`w-6 h-6 ${starClass}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.36-.55L12 2 8.36 8.69 2 9.24l4.54 4.73L5.82 21z" />
          </svg>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex mb-1">{renderStars()}</div>
      {disabled && (
        <p className="text-xs text-gray-500 text-center px-2">
          Log in to rate this property.
        </p>
      )}
      {loading && <p className="text-gray-500 text-sm">Submitting…</p>}
      {success && <p className="text-emerald-600 text-sm text-center">{success}</p>}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </div>
  );
};

export default StarRating;
