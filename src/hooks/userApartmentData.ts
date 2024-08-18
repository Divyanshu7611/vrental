// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// interface UserData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   adharNo: number;
//   image: string;
//   phone: number;
//   clientID: string;
//   participated: any[];
//   apartments: { $oid: string }[];
//   role: string;
//   __v: number;
// }

// interface ApartmentData {
//   apartmentName: string;
//   location: string;
//   image_urls: string[];
//   public_ids: string[];
//   description: string;
//   price: number;
//   contactNo: number;
//   furnitureDescription: string;
//   availableFor: string;
//   facility: string;
//   client: any[];
//   furniture: boolean;
//   parking: boolean;
//   electricity: boolean;
//   category: string;
//   ownerID: { $oid: string };
//   __v: number;
// }

// interface ApartmentInfo {
//   apartment: ApartmentData;
//   owner: UserData;
// }

// function useApartmentData(id: string | null) {
//   const [data, setData] = useState<ApartmentInfo | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (!id) {
//       router.push("/");
//       return;
//     }

//     const fetchInfo = async () => {
//       try {
//         setLoading(true);
//         const apartmentResponse = await axios.get<{ data: ApartmentData }>(
//           `/api/aparment/apartments?apartmentID=${id}`
//         );
//         console.log(apartmentResponse.data.data);

//         if (!apartmentResponse.data.data) {
//           router.push("/");
//           return;
//         }

//         const apartmentData = apartmentResponse.data.data;
//         const ownerID = apartmentData.ownerID;

//         const ownerResponse = await axios.get<{ data: UserData }>(
//           `/api/auth/getUser?id=${ownerID}`
//         );
//         console.log(ownerResponse.data.data);

//         setData({
//           apartment: apartmentData,
//           owner: ownerResponse.data.data,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to load data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInfo();
//   }, [id, router]);

//   return { data, loading, error };
// }

// export default useApartmentData;
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

interface ApartmentData {
  apartmentName: string;
  location: string;
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
  __v: number;
}

interface ApartmentInfo {
  apartment: ApartmentData;
  owner: UserData;
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

        setData({
          apartment: apartmentData,
          owner: ownerResponse.data.data,
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
