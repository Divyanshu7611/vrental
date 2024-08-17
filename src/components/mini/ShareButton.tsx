import React from "react";

export default function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this apartment!",
          text: "I found this great apartment on our website.",
          url: window.location.href,
        });
        alert("Thanks for sharing!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Web Share API not supported");
    }
  };
  return (
    <div>
      <button
        className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
        onClick={handleShare}
      >
        Share
      </button>
    </div>
  );
}
