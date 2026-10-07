import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  adharNo: number;
  image: string;
  phone: number;
  clientID: string;
  participated: any[];
  apartments: { $oid: string }[];
  role: string;
  __v: number;
}

interface BrokerProfileData {
  fullName: string;
  profilePhoto: string;
  mobile: number;
  email: string;
  firmName: string;
  officeAddress: string;
  areasServed: string;
  reraNumber: string;
  brokerageDetails: string;
  experience: string;
  otherDetails?: string;
}

interface ApartmentData {
  apartmentName: string;
  location: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  image_urls: string[];
  public_ids: string[];
  description: string;
  price: number;
  contactNo: number;
  furniture: string;
  availableFor: string;
  facility: string;
  client: any[];
  category: string;
  ownerID: { $oid: string };
  status: string;
  averageRating: number;
  instagramVideoLink?: string;
  youtubeVideoLink?: string;
  __v: number;
}

interface ApartmentInfo {
  apartment: ApartmentData;
  owner: UserData;
  broker?: BrokerProfileData | null;
}

function useApartmentData(id: string | null) {
  const [data, setData] = useState<ApartmentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const fetchInfo = async () => {
      try {
        const apartmentResponse = await axios.get<{ data: ApartmentData }>(
          `/api/aparment/apartments?apartmentID=${id}`
        );

        if (!apartmentResponse.data.data) {
          router.push("/");
          return;
        }

        const apartmentData = apartmentResponse.data.data;
        const ownerID = apartmentData.ownerID;

        const ownerResponse = await axios.get<{ data: UserData }>(
          `/api/auth/getUser?id=${ownerID}`
        );
        const ownerData = ownerResponse.data.data;

        let broker: BrokerProfileData | null = null;
        if (ownerData.role === "BROKER") {
          const brokerRes = await axios.get<{ data: BrokerProfileData | null }>(
            `/api/broker/public?userId=${ownerID}`
          );
          broker = brokerRes.data.data ?? null;
        }

        setData({
          apartment: apartmentData,
          owner: ownerData,
          broker,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [id, router]);

  return { data, loading, error };
}

export default useApartmentData;
