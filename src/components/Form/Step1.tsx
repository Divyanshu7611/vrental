"use client";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import FixedQrCode from "../payment/FixedQrCode";
import {
  FaTv,
  FaSnowflake,
  FaFan,
  FaWifi,
  FaBreadSlice,
  FaFire,
  FaBroom,
  FaCouch,
  FaBed,
  FaChair,
  FaBook,
  FaDoorOpen,
  FaLaptop,
  FaGraduationCap,
} from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { MdTableRestaurant, MdCoffee } from "react-icons/md";
import { GiWashingMachine, GiCooler } from "react-icons/gi";
import { BiSolidTv, BiFridge } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { Home, Users, User, Heart, Users2, Building2, Store } from "lucide-react";
import ReferralCodeInput from "./ReferralCodeInput";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import GoogleMapPicker from "./GoogleMapPicker";

type FormValues = {
  apartmentName: string;
  description: string;
  price: number;
  contactNo: number;
  category: string;
  availableFor: string;
  txnID: string;
};

// Icon mappings
const facilityIcons: { [key: string]: React.ReactNode } = {
  Television: <FaTv className="w-5 h-5" />,
  TV: <FaTv className="w-5 h-5" />,
  Refrigerator: <BiFridge className="w-5 h-5" />,
  Microwave: <IoMdCube className="w-5 h-5" />,
  Toaster: <FaBreadSlice className="w-5 h-5" />,
  Oven: <FaFire className="w-5 h-5" />,
  "Washing Machine": <GiWashingMachine className="w-5 h-5" />,
  "Air Conditioner": <FaSnowflake className="w-5 h-5" />,
  Cooler: <GiCooler className="w-5 h-5" />,
  Fan: <FaFan className="w-5 h-5" />,
  "Vacuum Cleaner": <FaBroom className="w-5 h-5" />,
  Wifi: <FaWifi className="w-5 h-5" />,
};

const furnitureIcons: { [key: string]: React.ReactNode } = {
  Sofa: <FaCouch className="w-5 h-5" />,
  Bed: <FaBed className="w-5 h-5" />,
  "Dining Table": <MdTableRestaurant className="w-5 h-5" />,
  "Coffee & Tea Table": <MdCoffee className="w-5 h-5" />,
  Dressing: <FaDoorOpen className="w-5 h-5" />,
  Chair: <FaChair className="w-5 h-5" />,
  Bookshelf: <FaBook className="w-5 h-5" />,
  Wardrobe: <FaDoorOpen className="w-5 h-5" />,
  Desk: <FaLaptop className="w-5 h-5" />,
  "TV Stand": <BiSolidTv className="w-5 h-5" />,
  Nightstand: <BsBox className="w-5 h-5" />,
  "Study Table": <FaGraduationCap className="w-5 h-5" />,
};

const getIcon = (item: string, type: "facility" | "furniture"): React.ReactNode => {
  const iconMap = type === "facility" ? facilityIcons : furnitureIcons;
  if (iconMap[item]) return iconMap[item];
  const normalizedItem = item.trim();
  const key = Object.keys(iconMap).find(
    (k) => k.toLowerCase() === normalizedItem.toLowerCase()
  );
  return key ? iconMap[key] : null;
};

const LISTING_DRAFT_STORAGE_KEY = "vrental_listingDraftApartmentId";

const Step1: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userContext = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({ mode: "onChange" });
  
  const apartmentName = watch("apartmentName");
  const description = watch("description");
  const price = watch("price");
  const contactNo = watch("contactNo");
  const category = watch("category");
  const availableFor = watch("availableFor");

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [furnitures, setFurniture] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState("");
  const [furnitureInput, setFurnitureInput] = useState("");

  const [localAddress, setLocalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapLat, setMapLat] = useState<number | undefined>(undefined);
  const [mapLng, setMapLng] = useState<number | undefined>(undefined);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [planAmount, setPlanAmount] = useState(0);
  const [planDuration, setPlanDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentStepDraftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentStepDraftInFlight = useRef(false);

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/auth";
  }, []);

  useEffect(() => {
    if (draftLoaded) return;
    const idFromQuery = searchParams.get("draftId");
    const idFromStorage =
      typeof window !== "undefined" ? localStorage.getItem(LISTING_DRAFT_STORAGE_KEY) : null;
    const idToLoad = idFromQuery || idFromStorage;
    if (!idToLoad) {
      setDraftLoaded(true);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/aparment/profileApartment?id=${idToLoad}`);
        const apt = res.data?.data;
        if (!apt?._id) throw new Error("Draft not found");

        setDraftId(String(apt._id));
        localStorage.setItem(LISTING_DRAFT_STORAGE_KEY, String(apt._id));
        setExistingImageUrls(Array.isArray(apt.image_urls) ? apt.image_urls : []);
        setValue("apartmentName", apt.apartmentName || "");
        setValue("description", apt.description || "");
        setValue("price", apt.price || 0);
        setValue("contactNo", apt.contactNo || 0);
        setValue("category", apt.category || "");
        setValue("availableFor", apt.availableFor || "");

        if (typeof apt.location === "string") {
          const parts = apt.location.split(", ");
          if (parts.length >= 4) {
            const pincodeValue = parts[parts.length - 1];
            const stateValue = parts[parts.length - 2];
            const cityValue = parts[parts.length - 3];
            const addressValue = parts.slice(0, -3).join(", ");
            setLocalAddress(addressValue);
            setCity(cityValue);
            setState(stateValue);
            setPincode(pincodeValue);
          }
        }

        if (apt.coordinates) {
          setMapLat(apt.coordinates.latitude);
          setMapLng(apt.coordinates.longitude);
        }

        setFacilities(typeof apt.facility === "string" ? apt.facility.split(", ") : []);
        setFurniture(typeof apt.furniture === "string" ? apt.furniture.split(", ") : []);

        setStep(4);
      } catch (e) {
        console.error("Failed to load draft:", e);
        toast.error("Could not load draft. Please try again.");
        try {
          localStorage.removeItem(LISTING_DRAFT_STORAGE_KEY);
        } catch {
          /* ignore */
        }
      } finally {
        setLoading(false);
        setDraftLoaded(true);
      }
    })();
  }, [searchParams, draftLoaded, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files).slice(0, 10));
    }
  };

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const moveImage = (from: number, to: number) => {
    if (from === to) return;
    setSelectedImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };
  const moveExistingUrl = (from: number, to: number) => {
    if (from === to) return;
    setExistingImageUrls((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const hasAnyImages = useMemo(() => {
    return selectedImages.length > 0 || existingImageUrls.length > 0;
  }, [selectedImages.length, existingImageUrls.length]);

  const saveDraft = async (opts?: {
    clearSelectedFiles?: boolean;
    silent?: boolean;
  }): Promise<string> => {
    const clearSelectedFiles = opts?.clearSelectedFiles ?? false;
    const silent = opts?.silent ?? false;

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please login again");

    const formData = watch();
    const fd = new FormData();
    const effectiveDraftId =
      draftId ||
      (typeof window !== "undefined" ? localStorage.getItem(LISTING_DRAFT_STORAGE_KEY) : null);
    if (effectiveDraftId) fd.append("draftId", effectiveDraftId);

    fd.append("apartmentName", formData.apartmentName);
    fd.append("description", formData.description);
    fd.append("price", String(formData.price));
    fd.append("contactNo", String(formData.contactNo));
    fd.append("facility", facilities.join(", "));
    fd.append("furniture", furnitures.join(", "));
    fd.append("location", `${localAddress}, ${city}, ${state}, ${pincode}`);
    fd.append("availableFor", formData.availableFor);
    fd.append("category", formData.category);

    if (mapLat && mapLng) {
      fd.append("latitude", mapLat.toString());
      fd.append("longitude", mapLng.toString());
    }

    if (planAmount) fd.append("paymentAmount", String(planAmount));
    if (planDuration) fd.append("membershipDuration", String(planDuration));

    // Preserve/merge existing uploaded image order when adding more images
    if (existingImageUrls.length > 0) {
      fd.append("image_urls", JSON.stringify(existingImageUrls));
    }

    selectedImages.forEach((file) => fd.append("image", file));

    const res = await axios.post(`/api/aparment/draft?id=${userContext?.userAuthData?._id}`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
    });

    if (!res.data?.success || !res.data?.data?._id) {
      throw new Error(res.data?.message || "Failed to save draft");
    }
    const newId = String(res.data.data._id);
    setDraftId(newId);
    try {
      localStorage.setItem(LISTING_DRAFT_STORAGE_KEY, newId);
    } catch {
      /* ignore */
    }
    if (Array.isArray(res.data.data.image_urls)) {
      setExistingImageUrls(res.data.data.image_urls);
    }
    if (clearSelectedFiles) {
      setSelectedImages([]);
    }
    if (!silent) {
      toast.success("Draft saved — you can continue payment anytime from your profile.");
    }
    return newId;
  };

  const saveDraftRef = useRef(saveDraft);
  saveDraftRef.current = saveDraft;

  const canPersistDraftAtPaymentStep = useCallback(() => {
    return (
      !!userContext?.userAuthData?._id &&
      !!apartmentName &&
      !!contactNo &&
      !!price &&
      !!category &&
      !!availableFor &&
      !!localAddress &&
      !!city &&
      !!state &&
      !!pincode &&
      !!description &&
      (selectedImages.length > 0 || existingImageUrls.length > 0)
    );
  }, [
    userContext?.userAuthData?._id,
    apartmentName,
    contactNo,
    price,
    category,
    availableFor,
    localAddress,
    city,
    state,
    pincode,
    description,
    selectedImages.length,
    existingImageUrls.length,
  ]);

  const paymentStep4Bootstrapped = useRef(false);

  useEffect(() => {
    if (step !== 4) {
      paymentStep4Bootstrapped.current = false;
    }
  }, [step]);

  useEffect(() => {
    if (!draftLoaded) return;
    if (step !== 4) return;
    if (!canPersistDraftAtPaymentStep()) return;

    const runSave = () => {
      if (paymentStepDraftInFlight.current) return;
      paymentStepDraftInFlight.current = true;
      void saveDraftRef
        .current({ silent: true, clearSelectedFiles: false })
        .catch((e) => {
          console.error("Auto draft save failed:", e);
        })
        .finally(() => {
          paymentStepDraftInFlight.current = false;
        });
    };

    if (!paymentStep4Bootstrapped.current) {
      paymentStep4Bootstrapped.current = true;
      runSave();
    }

    if (paymentStepDraftTimer.current) {
      clearTimeout(paymentStepDraftTimer.current);
    }

    paymentStepDraftTimer.current = setTimeout(runSave, 500);

    return () => {
      if (paymentStepDraftTimer.current) {
        clearTimeout(paymentStepDraftTimer.current);
      }
    };
  }, [
    draftLoaded,
    step,
    canPersistDraftAtPaymentStep,
    apartmentName,
    description,
    price,
    contactNo,
    category,
    availableFor,
    localAddress,
    city,
    state,
    pincode,
    mapLat,
    mapLng,
    facilities,
    furnitures,
    selectedImages,
    existingImageUrls,
    draftId,
    planAmount,
    planDuration,
    selectedPlan,
  ]);

  const handleAddFacility = () => {
    if (facilityInput && !facilities.includes(facilityInput)) {
      setFacilities([...facilities, facilityInput]);
      setFacilityInput("");
    }
  };

  const handleAddFurniture = () => {
    if (furnitureInput && !furnitures.includes(furnitureInput)) {
      setFurniture([...furnitures, furnitureInput]);
      setFurnitureInput("");
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  const handleRemoveFurniture = (furniture: string) => {
    setFurniture(furnitures.filter((f) => f !== furniture));
  };

  const handlePayment = async () => {
    if (!selectedPlan || !planAmount || !planDuration) {
      toast.error("Please select a membership plan");
      return;
    }

    // Validate form data before payment
    const formData = watch();
    
    // Check all required fields with specific error messages
    if (!formData.apartmentName) {
      toast.error("Please enter apartment name");
      setStep(1);
      return;
    }
    if (!formData.contactNo) {
      toast.error("Please enter contact number");
      setStep(1);
      return;
    }
    if (!formData.price) {
      toast.error("Please enter rent amount");
      setStep(1);
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      setStep(1);
      return;
    }
    if (!formData.availableFor) {
      toast.error("Please select available for option");
      setStep(1);
      return;
    }
    if (!localAddress || !city || !state || !pincode) {
      toast.error("Please complete all location details");
      setStep(2);
      return;
    }
    if (!formData.description) {
      toast.error("Please enter property description");
      setStep(3);
      return;
    }
    if (!hasAnyImages) {
      toast.error("Please upload at least one image");
      setStep(3);
      return;
    }
    
    // All validations passed

    setIsProcessing(true);

    try {
      const ensuredDraftId = await saveDraft({ silent: true, clearSelectedFiles: true });
      // Create Razorpay order
      const orderResponse = await axios.post("/api/payment/create-order", {
        amount: planAmount,
        apartmentID: ensuredDraftId,
        userID: userContext?.userAuthData?._id,
        duration: planDuration,
      });

      if (!orderResponse.data.success) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency } = orderResponse.data.data;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "VRental",
        description: `Property Listing - ${planDuration} Month${planDuration > 1 ? "s" : ""}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              apartmentID: ensuredDraftId,
              userID: userContext?.userAuthData?._id,
              duration: planDuration,
              amount: planAmount,
            });

            if (verifyResponse.data.success) {
              localStorage.removeItem("pendingReferralCode");
              try {
                localStorage.removeItem(LISTING_DRAFT_STORAGE_KEY);
              } catch {
                /* ignore */
              }
              toast.success("Payment successful! Your property is now listed.");
              router.push("/profile");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${userContext?.userAuthData?.firstName || ""} ${userContext?.userAuthData?.lastName || ""}`.trim(),
          email: userContext?.userAuthData?.email || "",
          contact: formData.contactNo?.toString() || "",
        },
        theme: {
          color: "#00F0FF",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("apartmentName", data.apartmentName);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("contactNo", data.contactNo.toString());
      formData.append("facility", facilities.join(", "));
      formData.append("furniture", furnitures.join(", "));
      formData.append(
        "location",
        `${localAddress}, ${city}, ${state}, ${pincode}`
      );
      formData.append("availableFor", data.availableFor);
      formData.append("category", data.category);
      formData.append("txnID", data.txnID);
      formData.append("membershipPlan", selectedPlan);
      formData.append("planAmount", planAmount.toString());

      selectedImages.forEach((file) => formData.append("image", file));

      await axios.post(
        `/api/aparment/createEvent?id=${userContext?.userAuthData?._id}`,
        formData
      );

      toast.success("Apartment created successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full"
    >
      {/* Step Indicator */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4 relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          
          {[
            { num: 1, label: "Basic Info" },
            { num: 2, label: "Location" },
            { num: 3, label: "Media" },
            { num: 4, label: "Payment" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                  step >= s.num
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg scale-110"
                    : "bg-white border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step > s.num ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  step >= s.num ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apartment Name *
                </label>
                <input
                  {...register("apartmentName", { required: "Apartment name is required" })}
                  placeholder="e.g., Raman Villa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.apartmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apartmentName.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    {...register("contactNo", { required: "Contact number is required" })}
                    placeholder="9854761278"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.contactNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactNo.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rent per Month (₹) *
                  </label>
                  <input
                    type="number"
                    {...register("price", { required: "Price is required" })}
                    placeholder="5000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "ROOM", label: "Room", icon: <Home className="w-6 h-6" /> },
                    { value: "PG", label: "PG", icon: <Building2 className="w-6 h-6" /> },
                    { value: "HOSTEL", label: "Hostel", icon: <Users className="w-6 h-6" /> },
                    { value: "CO-LIVING", label: "Co-Living", icon: <Users2 className="w-6 h-6" /> },
                    { value: "FLAT", label: "Flat", icon: <Home className="w-6 h-6" /> },
                    { value: "SHOP", label: "Shop", icon: <Store className="w-6 h-6" /> },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setValue("category", cat.value, { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        category === cat.value
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${category === cat.value ? "text-blue-600" : "text-gray-600"}`}>
                        {cat.icon}
                      </div>
                      <span className={`text-sm font-semibold ${category === cat.value ? "text-blue-600" : "text-gray-700"}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register("category", { required: "Category is required" })}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.category.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available For *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Boys", label: "Boys", icon: <User className="w-6 h-6" /> },
                    { value: "Girls", label: "Girls", icon: <User className="w-6 h-6" /> },
                    { value: "Family", label: "Family", icon: <Users className="w-6 h-6" /> },
                    { value: "Couple", label: "Couple", icon: <Heart className="w-6 h-6" /> },
                    { value: "Any", label: "Any", icon: <Users2 className="w-6 h-6" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("availableFor", option.value, { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        availableFor === option.value
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${availableFor === option.value ? "text-blue-600" : "text-gray-600"}`}>
                        {option.icon}
                      </div>
                      <span className={`text-sm font-semibold ${availableFor === option.value ? "text-blue-600" : "text-gray-700"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register("availableFor", { required: "Available for is required" })}
                />
                {errors.availableFor && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.availableFor.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Location * (Google Maps)
                </label>
                <GooglePlacesAutocomplete
                  value={localAddress}
                  onChange={(value) => setLocalAddress(value)}
                  onPlaceSelected={(place) => {
                    setLocalAddress(place.address);
                    setCity(place.city);
                    setState(place.state);
                    setPincode(place.pincode);
                    setMapLat(place.lat);
                    setMapLng(place.lng);
                  }}
                  placeholder="Search for your property location..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Start typing to see location suggestions from Google Maps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Jaipur"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g., Rajasthan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g., 302001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Google Map Picker */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📍 Mark Location on Map
              </h3>
              <GoogleMapPicker
                onLocationSelect={(location) => {
                  setLocalAddress(location.address);
                  setCity(location.city);
                  setState(location.state);
                  setPincode(location.pincode);
                  setMapLat(location.lat);
                  setMapLng(location.lng);
                }}
                initialLat={mapLat}
                initialLng={mapLng}
                externalLat={mapLat}
                externalLng={mapLng}
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Media & Description</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                placeholder="Describe your property in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={5}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Description is required
                </p>
              )}
            </div>

            {/* Facilities Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Electronics & Facilities (Select Multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  "Television",
                  "Refrigerator",
                  "Microwave",
                  "Toaster",
                  "Oven",
                  "Washing Machine",
                  "Air Conditioner",
                  "Cooler",
                  "Fan",
                  "Vacuum Cleaner",
                  "Wifi",
                ].map((facility) => {
                  const isSelected = facilities.includes(facility);
                  const icon = getIcon(facility, "facility");
                  return (
                    <button
                      key={facility}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveFacility(facility);
                        } else {
                          setFacilities([...facilities, facility]);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${isSelected ? "text-blue-600" : "text-gray-600"}`}>
                        {icon || <FaTv className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold text-center ${isSelected ? "text-blue-600" : "text-gray-700"}`}>
                        {facility}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {facilities.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">
                    Selected ({facilities.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {getIcon(facility, "facility")}
                        <span>{facility}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(facility)}
                          className="text-red-600 font-bold hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Furniture Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Furniture (Select Multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  "Sofa",
                  "Bed",
                  "Dining Table",
                  "Coffee & Tea Table",
                  "Dressing",
                  "Chair",
                  "Bookshelf",
                  "Wardrobe",
                  "Desk",
                  "TV Stand",
                  "Nightstand",
                  "Study Table",
                ].map((furniture) => {
                  const isSelected = furnitures.includes(furniture);
                  const icon = getIcon(furniture, "furniture");
                  return (
                    <button
                      key={furniture}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveFurniture(furniture);
                        } else {
                          setFurniture([...furnitures, furniture]);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${isSelected ? "text-purple-600" : "text-gray-600"}`}>
                        {icon || <FaCouch className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold text-center ${isSelected ? "text-purple-600" : "text-gray-700"}`}>
                        {furniture}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {furnitures.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">
                    Selected ({furnitures.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {furnitures.map((furniture, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {getIcon(furniture, "furniture")}
                        <span>{furniture}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFurniture(furniture)}
                          className="text-red-600 font-bold hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Images (Up to 10 images)
              </label>
              
              {/* Image Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-colors duration-200"
                >
                  {selectedImages.length === 0 && existingImageUrls.length === 0 ? (
                    <>
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB (max 10 images)
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-blue-500 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        Click to add more images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {existingImageUrls.length + selectedImages.length}/10 images selected
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Image Preview Grid */}
              {(existingImageUrls.length > 0 || selectedImages.length > 0) && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-3">
                    Tip: drag and drop to change the order (1st image is the cover).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImageUrls.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex == null) return;
                          moveExistingUrl(dragIndex, index);
                          setDragIndex(null);
                        }}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                          Image {index + 1} (saved)
                        </div>
                      </div>
                    ))}

                    {selectedImages.map((image, index) => (
                      <div
                        key={`new-${index}`}
                        draggable
                        onDragStart={() => setDragIndex(existingImageUrls.length + index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex == null) return;
                          // Only reorder within the "new files" list.
                          const from = dragIndex - existingImageUrls.length;
                          if (from >= 0) moveImage(from, index);
                          setDragIndex(null);
                        }}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-move"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImages(selectedImages.filter((_, i) => i !== index));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                          Image {existingImageUrls.length + index + 1} (new)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={selectedImages.length === 0}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            {/* Limited Time Launch Offer Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 mb-6 shadow-2xl">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full animate-pulse delay-700"></div>
              </div>
              
              {/* Sparkle animations */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
              <div className="absolute bottom-6 left-12 w-2 h-2 bg-white rounded-full animate-ping delay-500"></div>
              <div className="absolute bottom-4 right-16 w-2 h-2 bg-white rounded-full animate-ping delay-700"></div>
              
              <div className="relative z-10 text-center">
                {/* Animated badge */}
                <div className="inline-block mb-3">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-white/40 animate-bounce">
                    <span className="text-white text-xs font-bold tracking-wider">🎉 SPECIAL LAUNCH OFFER 🎉</span>
                  </div>
                </div>
                
                {/* Main heading with gradient text */}
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                  <span className="inline-block animate-pulse">Limited Time</span>{" "}
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white animate-shimmer">
                    Launch Offer
                  </span>
                </h3>
                
                <p className="text-white/90 text-lg font-semibold mb-3">
                  For Early Property Owners
                </p>
                
                {/* Discount highlight */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                    <span className="text-white font-bold text-xl">🔥 50% OFF</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                    <span className="text-white font-bold text-xl">⚡ Instant Activation</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                    <span className="text-white font-bold text-xl">🎁 Premium Features</span>
                  </div>
                </div>
                
                {/* Countdown or urgency message */}
                <div className="mt-4 inline-block">
                  <div className="bg-red-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-400/50 animate-pulse">
                    <span className="text-white text-sm font-bold">⏰ Limited Slots Available - Register Now!</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-white/30 rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-white/30 rounded-br-2xl"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Membership Plan</h2>

            {/* Referral Code Section */}
            <ReferralCodeInput />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(() => {
                const formData = watch();
                const category = formData.category;
                
                // Determine pricing based on category
                let plans = [];
                if (category === "ROOM" || category === "PG" || category === "HOSTEL" || category === "CO-LIVING") {
                  // Rooms / PG / Hostel pricing
                  plans = [
                    { name: "1 Month", value: "1month", duration: 1, price: 99, originalPrice: 198, savings: "Save 50%" },
                    { name: "3 Months", value: "3months", duration: 3, price: 199, originalPrice: 398, savings: "Save 50%" },
                    { name: "6 Months", value: "6months", duration: 6, price: 299, originalPrice: 598, savings: "Save 50%" },
                  ];
                } else if (category === "FLAT") {
                  // Flats / Apartments pricing
                  plans = [
                    { name: "1 Month", value: "1month", duration: 1, price: 1, originalPrice: 398, savings: "Save 50%" },
                    { name: "3 Months", value: "3months", duration: 3, price: 399, originalPrice: 798, savings: "Save 50%" },
                    { name: "6 Months", value: "6months", duration: 6, price: 599, originalPrice: 1198, savings: "Save 50%" },
                  ];
                } else if (category === "SHOP") {
                  // Commercial Properties pricing
                  plans = [
                    { name: "1 Month", value: "1month", duration: 1, price: 299, originalPrice: 598, savings: "Save 50%" },
                    { name: "3 Months", value: "3months", duration: 3, price: 699, originalPrice: 1398, savings: "Save 50%" },
                    { name: "6 Months", value: "6months", duration: 6, price: 999, originalPrice: 1998, savings: "Save 50%" },
                  ];
                } else {
                  // Default to Room pricing if category not selected
                  plans = [
                    { name: "1 Month", value: "1month", duration: 1, price: 99, originalPrice: 198, savings: "Save 50%" },
                    { name: "3 Months", value: "3months", duration: 3, price: 199, originalPrice: 398, savings: "Save 50%" },
                    { name: "6 Months", value: "6months", duration: 6, price: 299, originalPrice: 598, savings: "Save 50%" },
                  ];
                }
                
                return plans;
              })().map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => {
                    setSelectedPlan(plan.value);
                    setPlanAmount(plan.price);
                    setPlanDuration(plan.duration);
                  }}
                  className={`border-2 p-6 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPlan === plan.value
                      ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                      : "border-gray-300 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{plan.price}
                    </div>
                    <div className="text-sm text-gray-500 line-through mb-2">
                      ₹{plan.originalPrice}
                    </div>
                    {plan.savings && (
                      <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {plan.savings}
                      </div>
                    )}
                    <ul className="text-sm text-gray-600 space-y-1 mt-3 text-left">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Listing for {plan.name.toLowerCase()}
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Priority support
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Instant activation
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {!selectedPlan && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm text-center">
                  Please select a membership plan to continue
                </p>
              </div>
            )}

            {selectedPlan && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Selected Plan</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    ₹{planAmount}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    for {planDuration} month{planDuration > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment powered by Razorpay</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={!selectedPlan || isProcessing}
                className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
                  selectedPlan && !isProcessing
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </form>
  );
};

export default Step1;