"use client";
import axios from "axios";
import React, { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import StarRating from "../Profile/Rating";
import MessageModal from "../messaging/MessageModal";
import { Share2, MessageCircle, Phone, Heart, Check, Loader2 } from "lucide-react";

interface OwnerDetailsProps {
  data: {
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    _id?: string;
  };
  contactNo: number;
  apartmentID?: string;
  apartmentName?: string;
}

function formatContactDisplay(num: number): string {
  const digits = String(num).replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return String(num);
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ data, contactNo, apartmentID, apartmentName }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallProcessing, setCallProcessing] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [conversationID, setConversationID] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const userContext = useContext(UserContext);
  const searchParams = useSearchParams();
  const id = String(searchParams.get("apartmentID") || apartmentID || "").trim();

  const handleInterestedClick = async () => {
    if (isApplied) return;
    try {
      setIsProcessing(true);
      const response = await axios.post("/api/aparment/interested", {
        UserID: userContext?.userAuthData?._id, // Replace with actual user ID
        ApartmentID: id, // Replace with actual apartment ID
        ownerEmail: data.email,
      });

      if (response.status === 200) {
        // Handle success (e.g., show a success message)
        alert("You have successfully registered your interest.");
        setIsApplied(true);
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error registering interest:", error);
      alert("There was an error registering your interest. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  // calling function
  const handleCallClick = async () => {
    try {
      setCallProcessing(true);
      const response = await axios.post("/api/aparment/call", {
        UserID: userContext?.userAuthData?._id, // Replace with actual user ID
        ApartmentID: id, // Replace with actual apartment ID
        ownerEmail: data.email,
      });

      if (response.status === 200) {
        // Handle success (e.g., show a success message)
        setIsCall(true);
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error registering interest:", error);
    } finally {
      setCallProcessing(false);
    }
  };

  // Handle message button click
  const handleMessageClick = async () => {
    const ownerID = data._id || (data as any).id;
    
    if (!userContext?.userAuthData?._id || !id || !ownerID) {
      alert("Unable to start conversation. Please try again.");
      return;
    }

    // Check if user is trying to message themselves
    if (userContext.userAuthData._id === ownerID) {
      alert("You cannot message yourself.");
      return;
    }

    setIsCreatingConversation(true);
    try {
      const response = await axios.post("/api/messages/conversation", {
        userID: userContext.userAuthData._id,
        apartmentID: id,
      });

      if (response.data.success) {
        setConversationID(response.data.data.conversationID);
        setIsMessageModalOpen(true);
      }
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      alert(error.response?.data?.message || "Failed to start conversation. Please try again.");
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this apartment!",
          text: "I found this great apartment on our website.",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // return (
  //   <div className="lg:w-1/4 flex lg:flex-col items-center flex-row gap-5">
  //     <div className="flex flex-col justify-center items-center">
  //       <img
  //         src={`https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}&backgroundColor=418FA9`}
  //         alt="Owner"
  //         height={200}
  //         width={200}
  //         className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D] mb-4"
  //       />

  //       <h2 className="lg:text-xl text-lg font-semibold mb-2 text-center">
  //         {data.firstName} {data.lastName}
  //       </h2>
  //     </div>
  //     <div className="flex flex-col gap-3">
  //       <a href={`tel:${contactNo}`}>
  //         <button
  //           className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
  //           onClick={handleCallClick}
  //         >
  //           Call Now
  //         </button>
  //       </a>

  //       <ShareButton />

  //       <a>
  //         <button
  //           className="bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
  //           onClick={handleInterestedClick}
  //           disabled={isProcessing || isApplied}
  //         >
  //           {isProcessing
  //             ? "Processing..."
  //             : isApplied
  //             ? "Applied"
  //             : "Interested"}
  //         </button>
  //       </a>
  //       <p>Rate Appartment</p>
  //       <StarRating userId={userContext?.userAuthData?._id} apartmentId={id} />
  //     </div>
  //   </div>
  // );
  const btnBase =
    "inline-flex w-full min-h-[3.25rem] items-center justify-center gap-2.5 rounded-2xl px-4 text-[15px] font-semibold tracking-tight shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 disabled:active:scale-100";

  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.03]">
      {/* subtle top accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-slate-800" aria-hidden />

      <div className="p-5 sm:p-6">
      {/* Owner Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative shrink-0">
          <img
            src={`https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}&backgroundColor=418FA9`}
            alt=""
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-lg text-gray-900">
            {data.firstName} {data.lastName}
          </h2>
          <p className="text-sm text-gray-500">Property owner</p>
        </div>
      </div>
  
      {/* Contact / mobile */}
      <div className="mb-5 rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
            aria-hidden
          >
            <Phone className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
              Mobile
            </p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-gray-900 tabular-nums">
              {formatContactDisplay(contactNo)}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Tap call below to reach the owner
            </p>
          </div>
        </div>
      </div>
  
      {/* Actions */}
      <div className="mb-1">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
          Connect
        </p>
        <div className="flex flex-col gap-2.5">
          <a href={`tel:${contactNo}`} className="block">
            <button
              type="button"
              className={`${btnBase} bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/25 focus-visible:ring-emerald-500`}
              onClick={handleCallClick}
              disabled={isCallProcessing}
              aria-busy={isCallProcessing}
            >
              {isCallProcessing ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" strokeWidth={2.25} />
              ) : (
                <Phone className="h-5 w-5 shrink-0" strokeWidth={2.25} />
              )}
              Call now
            </button>
          </a>

          <button
            type="button"
            className={`${btnBase} ${
              isApplied
                ? "pointer-events-none cursor-default bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 shadow-none focus-visible:ring-emerald-400"
                : "border border-indigo-200/80 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-md hover:shadow-indigo-500/30 focus-visible:ring-indigo-500"
            }`}
            onClick={handleInterestedClick}
            disabled={isProcessing}
            aria-busy={isProcessing}
            aria-disabled={isApplied}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            ) : isApplied ? (
              <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            ) : (
              <Heart className="h-5 w-5 shrink-0" strokeWidth={2.25} />
            )}
            {isProcessing ? "Sending…" : isApplied ? "Interest sent" : "Interested"}
          </button>

          <button
            type="button"
            className={`${btnBase} border border-cyan-300/60 bg-gradient-to-b from-[#5FF4FF] to-[#00D4E6] text-slate-900 shadow-cyan-500/15 hover:from-[#7FF8FF] hover:to-[#00c9d9] hover:shadow-md hover:shadow-cyan-500/20 focus-visible:ring-cyan-500`}
            onClick={handleMessageClick}
            disabled={isCreatingConversation}
            aria-busy={isCreatingConversation}
          >
            {isCreatingConversation ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            ) : (
              <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.25} />
            )}
            {isCreatingConversation ? "Opening…" : "Message owner"}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-x-4 top-1/2 border-t border-gray-100" aria-hidden />
            <span className="relative mx-auto block w-fit bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-300">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className={`${btnBase} border border-gray-200 bg-white text-gray-800 shadow-none hover:border-gray-300 hover:bg-gray-50/90 hover:shadow-sm focus-visible:ring-gray-400`}
          >
            <Share2 className="h-5 w-5 shrink-0 text-gray-600" strokeWidth={2} />
            Share listing
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="font-medium mb-2">
          Rate Apartment
        </p>
        <StarRating
          userId={userContext?.userAuthData?._id}
          apartmentId={id}
        />
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        conversationID={conversationID}
        ownerData={{
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        }}
        apartmentName={apartmentName || "Property"}
      />
      </div>
    </div>
  );

};

export default OwnerDetails;
