"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GooglePlacesAutocomplete from "@/components/Form/GooglePlacesAutocomplete";
import GoogleMapPicker from "@/components/Form/GoogleMapPicker";
import {
  LISTING_MIN_DESCRIPTION_LENGTH,
  getMembershipPlansForCategory,
  normalizeListingCategory,
} from "@/lib/listingMembershipPlans";
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

type FormValues = {
  ownerEmail: string;
  apartmentName: string;
  description: string;
  price: number;
  contactNo: number;
  category: string;
  availableFor: string;
};

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

const FACILITIES = [
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
];

const FURNITURE_OPTIONS = [
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
];

export default function AdminRegisterApartmentForm() {
  const router = useRouter();

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      ownerEmail: "",
      apartmentName: "",
      description: "",
      category: "",
      availableFor: "",
    },
  });

  const apartmentName = watch("apartmentName");
  const description = watch("description");
  const price = watch("price");
  const contactNo = watch("contactNo");
  const category = watch("category");
  const availableFor = watch("availableFor");
  const ownerEmail = watch("ownerEmail");

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [localAddress, setLocalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapLat, setMapLat] = useState<number | undefined>(undefined);
  const [mapLng, setMapLng] = useState<number | undefined>(undefined);

  const [facilities, setFacilities] = useState<string[]>([]);
  const [furnitures, setFurniture] = useState<string[]>([]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [planDuration, setPlanDuration] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  const prevCategoryRef = useRef<string | null>(null);
  useEffect(() => {
    const cur = category || "";
    const prev = prevCategoryRef.current;
    if (prev !== null && prev !== "" && prev !== cur) {
      setSelectedPlan("");
      setPlanDuration(0);
    }
    prevCategoryRef.current = cur;
  }, [category]);

  const prevStep = () => step > 1 && setStep(step - 1);

  const hasAnyImages = selectedImages.length > 0;

  const isStep2LocationComplete = useMemo(() => {
    return (
      localAddress.trim().length >= 3 &&
      !!city.trim() &&
      !!state.trim() &&
      /^\d{5,10}$/.test(pincode.trim()) &&
      mapLat != null &&
      mapLng != null &&
      Number.isFinite(mapLat) &&
      Number.isFinite(mapLng)
    );
  }, [localAddress, city, state, pincode, mapLat, mapLng]);

  const isStep1BasicsComplete = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((ownerEmail ?? "").trim());
    const nameOk = (apartmentName ?? "").trim().length > 0;
    const priceNum = Number(price);
    const priceOk = Number.isFinite(priceNum) && priceNum >= 1;
    const contactDigits = String(contactNo ?? "").replace(/\D/g, "");
    const contactOk = contactDigits.length >= 10;
    const categoryOk = (category ?? "").trim().length > 0;
    const availableOk = (availableFor ?? "").trim().length > 0;
    return emailOk && nameOk && priceOk && contactOk && categoryOk && availableOk;
  }, [ownerEmail, apartmentName, price, contactNo, category, availableFor]);

  const isStep3MediaComplete = useMemo(() => {
    const descOk = (description ?? "").trim().length >= LISTING_MIN_DESCRIPTION_LENGTH;
    return hasAnyImages && descOk && facilities.length > 0;
  }, [hasAnyImages, description, facilities]);

  const listingReadyForPlan = useMemo(() => {
    return isStep1BasicsComplete && isStep2LocationComplete && isStep3MediaComplete;
  }, [isStep1BasicsComplete, isStep2LocationComplete, isStep3MediaComplete]);

  const goToNextStep = useCallback(async () => {
    if (step === 1) {
      const fieldsOk = await trigger([
        "ownerEmail",
        "apartmentName",
        "contactNo",
        "price",
        "category",
        "availableFor",
      ]);
      if (!fieldsOk) {
        toast.error("Fix the highlighted fields.");
        return;
      }
      if (!isStep1BasicsComplete) {
        toast.error("Check owner email and required basics.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!isStep2LocationComplete) {
        toast.error("Complete address, pincode, and map pin.");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      const descOk = await trigger("description");
      if (!descOk) {
        toast.error("Description must meet the minimum length.");
        return;
      }
      if (facilities.length === 0) {
        toast.error("Select at least one facility.");
        return;
      }
      if (!hasAnyImages) {
        toast.error("Upload at least one image.");
        return;
      }
      setStep(4);
    }
  }, [
    step,
    trigger,
    isStep1BasicsComplete,
    isStep2LocationComplete,
    facilities.length,
    hasAnyImages,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files).slice(0, 10));
      e.target.value = "";
    }
  };

  const onFinalSubmit = async () => {
    if (!selectedPlan || planDuration <= 0) {
      toast.error("Select a membership plan.");
      return;
    }
    const plans = getMembershipPlansForCategory(category);
    const chosen = plans.find((p) => p.value === selectedPlan);
    if (!chosen || chosen.duration !== planDuration) {
      toast.error("Choose the plan again for this category.");
      return;
    }

    const form = watch();
    const contactDigits = String(form.contactNo ?? "").replace(/\D/g, "");
    if (contactDigits.length < 10) {
      toast.error("Valid contact number required.");
      setStep(1);
      return;
    }
    if (
      mapLat == null ||
      mapLng == null ||
      !Number.isFinite(mapLat) ||
      !Number.isFinite(mapLng)
    ) {
      toast.error("Map coordinates required.");
      setStep(2);
      return;
    }
    if ((form.description ?? "").trim().length < LISTING_MIN_DESCRIPTION_LENGTH) {
      toast.error("Description too short.");
      setStep(3);
      return;
    }
    if (facilities.length === 0 || !hasAnyImages) {
      toast.error("Images and facilities required.");
      setStep(3);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in again.");
      router.push("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("ownerEmail", (form.ownerEmail ?? "").trim());
      fd.append("apartmentName", (form.apartmentName ?? "").trim());
      fd.append("description", (form.description ?? "").trim());
      fd.append("price", String(form.price));
      fd.append("contactNo", String(form.contactNo));
      fd.append("facility", facilities.join(", "));
      fd.append("furniture", furnitures.join(", "));
      fd.append("location", `${localAddress}, ${city}, ${state}, ${pincode}`);
      fd.append("availableFor", form.availableFor);
      fd.append("category", form.category);
      fd.append("membershipPlan", selectedPlan);
      fd.append("latitude", String(mapLat));
      fd.append("longitude", String(mapLng));
      selectedImages.forEach((file) => fd.append("image", file));

      const res = await axios.post("/api/admin/apartment/create", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Listing created for owner.");
        router.push("/admin");
      } else {
        toast.error(res.data?.message || "Request failed");
      }
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { message?: string } } };
      toast.error(ax?.response?.data?.message || "Could not create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4 relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          {[
            { num: 1, label: "Owner & basics" },
            { num: 2, label: "Location" },
            { num: 3, label: "Media" },
            { num: 4, label: "Membership" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all ${
                  step >= s.num
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg"
                    : "bg-white border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center max-w-[5.5rem] ${
                  step >= s.num ? "text-violet-600" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-gray-100">
        {step === 1 && (
          <>
            <div className="rounded-lg bg-violet-50 border border-violet-100 p-4 text-sm text-violet-900">
              <p className="font-semibold">Admin listing</p>
              <p className="mt-1 text-violet-800/90">
                Enter the owner&apos;s <strong>registered email</strong> (they must already have an{" "}
                <strong>OWNER</strong> account). Membership is applied without payment.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Owner &amp; property basics</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owner registered email *
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register("ownerEmail", { required: "Owner email is required" })}
                placeholder="owner@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
              {errors.ownerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.ownerEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apartment name *</label>
              <input
                {...register("apartmentName", { required: "Required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
              {errors.apartmentName && (
                <p className="text-red-500 text-sm mt-1">{errors.apartmentName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact *</label>
                <input
                  type="tel"
                  {...register("contactNo", { required: "Required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rent / month (₹) *</label>
                <input
                  type="number"
                  {...register("price", { required: "Required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category *</label>
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
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      category === cat.value
                        ? "border-violet-600 bg-violet-50 shadow-md"
                        : "border-gray-300 hover:border-violet-300"
                    }`}
                  >
                    <div className={category === cat.value ? "text-violet-600" : "text-gray-600"}>
                      {cat.icon}
                    </div>
                    <span className="text-sm font-semibold mt-2">{cat.label}</span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("category", { required: true })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Available for *</label>
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
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      availableFor === option.value
                        ? "border-violet-600 bg-violet-50 shadow-md"
                        : "border-gray-300 hover:border-violet-300"
                    }`}
                  >
                    <div className={availableFor === option.value ? "text-violet-600" : "text-gray-600"}>
                      {option.icon}
                    </div>
                    <span className="text-sm font-semibold mt-2">{option.label}</span>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("availableFor", { required: true })} />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => void goToNextStep()}
                disabled={!isStep1BasicsComplete}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold disabled:bg-gray-300"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Location</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search (Google)</label>
              <GooglePlacesAutocomplete
                value={localAddress}
                onChange={(v) => setLocalAddress(v)}
                onPlaceSelected={(place) => {
                  setLocalAddress(place.address);
                  setCity(place.city);
                  setState(place.state);
                  setPincode(place.pincode);
                  setMapLat(place.lat);
                  setMapLng(place.lng);
                }}
                placeholder="Search property location..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">City *</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">State *</label>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Pincode *</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <GoogleMapPicker
              onLocationSelect={(loc) => {
                setLocalAddress(loc.address);
                setCity(loc.city);
                setState(loc.state);
                setPincode(loc.pincode);
                setMapLat(loc.lat);
                setMapLng(loc.lng);
              }}
              initialLat={mapLat}
              initialLng={mapLng}
              externalLat={mapLat}
              externalLng={mapLng}
            />
            <div className="flex justify-between pt-4 border-t">
              <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-lg font-semibold">
                ← Back
              </button>
              <button
                type="button"
                onClick={() => void goToNextStep()}
                disabled={!isStep2LocationComplete}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold disabled:bg-gray-300"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Media &amp; details</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                {...register("description", {
                  required: true,
                  minLength: LISTING_MIN_DESCRIPTION_LENGTH,
                })}
                rows={5}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={`Minimum ${LISTING_MIN_DESCRIPTION_LENGTH} characters`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">Description required (min length).</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Facilities *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {FACILITIES.map((facility) => {
                  const isSelected = facilities.includes(facility);
                  const icon = getIcon(facility, "facility");
                  return (
                    <button
                      key={facility}
                      type="button"
                      onClick={() =>
                        setFacilities((prev) =>
                          isSelected ? prev.filter((x) => x !== facility) : [...prev, facility]
                        )
                      }
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 ${
                        isSelected ? "border-violet-600 bg-violet-50" : "border-gray-300"
                      }`}
                    >
                      <div className="mb-2">{icon || <FaTv className="w-5 h-5" />}</div>
                      <span className="text-xs font-semibold text-center">{facility}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Furniture <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {FURNITURE_OPTIONS.map((furniture) => {
                  const isSelected = furnitures.includes(furniture);
                  const icon = getIcon(furniture, "furniture");
                  return (
                    <button
                      key={furniture}
                      type="button"
                      onClick={() =>
                        setFurniture((prev) =>
                          isSelected ? prev.filter((x) => x !== furniture) : [...prev, furniture]
                        )
                      }
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 ${
                        isSelected ? "border-fuchsia-600 bg-fuchsia-50" : "border-gray-300"
                      }`}
                    >
                      <div className="mb-2">{icon || <FaCouch className="w-5 h-5" />}</div>
                      <span className="text-xs font-semibold text-center">{furniture}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Images * (max 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600"
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{selectedImages.length} file(s) selected</p>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-lg font-semibold">
                ← Back
              </button>
              <button
                type="button"
                onClick={() => void goToNextStep()}
                disabled={!isStep3MediaComplete}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold disabled:bg-gray-300"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Complimentary membership</p>
              <p className="mt-1">
                The chosen plan duration is applied with <strong>payment ₹0</strong> and listing status{" "}
                <strong>Verified</strong>. Same tiers as the owner-facing flow for this category.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Membership plan</h2>

            {!listingReadyForPlan && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                Complete previous steps (description, facilities, images, location). Use Back to edit.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getMembershipPlansForCategory(category).map((plan) => (
                <button
                  key={`${normalizeListingCategory(category)}-${plan.value}`}
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan.value);
                    setPlanDuration(plan.duration);
                  }}
                  className={`border-2 p-6 rounded-xl text-left transition-all ${
                    selectedPlan === plan.value
                      ? "border-violet-600 bg-violet-50 shadow-lg"
                      : "border-gray-300 hover:border-violet-300"
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-500 line-through mt-1">List price ₹{plan.originalPrice}</p>
                  <p className="text-2xl font-bold text-violet-600 mt-1">₹{plan.price}</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-2">Admin: charged ₹0</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-lg font-semibold">
                ← Back
              </button>
              <button
                type="button"
                disabled={!selectedPlan || submitting || !listingReadyForPlan}
                onClick={() => void onFinalSubmit()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold disabled:bg-gray-300"
              >
                {submitting ? "Creating…" : "Create listing for owner"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
