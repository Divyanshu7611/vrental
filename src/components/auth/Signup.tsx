// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import Spinner from "../global/Spinner";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";

// interface FormValues {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phone: string;
//   otp: string;
//   adharNo: string;
// }

// export default function Signup() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     getValues,
//   } = useForm<FormValues>();
//   const router = useRouter();
//   const [state, setState] = useState({
//     isEmailSent: false,
//     isLoading: false,
//     countdown: 0,
//     otp: "",
//     enteredOtp: "",
//     isOtpVerified: false,
//     showTermsModal: false,
//     isTermsAccepted: false,
//   });

//   const handleError = useCallback((message: string) => {
//     toast.error(message);
//     setState((prev) => ({ ...prev, isLoading: false }));
//   }, []);

//   const handleSuccess = useCallback((message: string) => {
//     toast.success(message);
//     setState((prev) => ({ ...prev, isLoading: false }));
//   }, []);

//   const handleEmailValidation = async () => {
//     const email = getValues("email");
//     if (!email) {
//       handleError("Please enter an email address");
//       return;
//     }

//     try {
//       setState((prev) => ({ ...prev, isLoading: true }));
//       const { data } = await axios.post("/api/auth/otp", { email });
//       if (data.success) {
//         setState((prev) => ({
//           ...prev,
//           otp: data.otp,
//           isEmailSent: true,
//           isLoading: false,
//         }));
//         startCountdown();
//         handleSuccess("OTP sent to your email");
//       } else {
//         handleError("Failed to send OTP");
//       }
//     } catch (error) {
//       handleError("An error occurred while sending OTP");
//       console.error("OTP Error:", error);
//     }
//   };

//   const verifyOtp = () => {
//     if (state.otp === state.enteredOtp) {
//       handleSuccess("OTP verified successfully");
//       setState((prev) => ({ ...prev, isOtpVerified: true }));
//     } else {
//       handleError("Invalid OTP");
//     }
//   };

//   const startCountdown = () => {
//     setState((prev) => ({ ...prev, countdown: 90 }));
//     const timer = setInterval(() => {
//       setState((prev) => {
//         if (prev.countdown <= 1) {
//           clearInterval(timer);
//           return { ...prev, countdown: 0 };
//         }
//         return { ...prev, countdown: prev.countdown - 1 };
//       });
//     }, 1000);
//   };

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     if (!state.isTermsAccepted) {
//       handleError("Please accept the Terms and Conditions");
//       return;
//     }

//     if (data.password !== data.confirmPassword) {
//       handleError("Password and Confirm Password do not match");
//       return;
//     }

//     try {
//       setState((prev) => ({ ...prev, isLoading: true }));
//       const { data: responseData } = await axios.post(
//         "/api/auth/register",
//         data
//       );
//       if (responseData.success) {
//         handleSuccess(responseData.message);
//         router.refresh();
//       } else {
//         handleError("User already exists");
//       }
//     } catch (error) {
//       handleError("Something went wrong during registration");
//       console.error("Registration Error:", error);
//     }
//   };

//   useEffect(() => {
//     // Trigger error toast for form validation errors
//     Object.values(errors).forEach((error: any) => {
//       if (error.message) handleError(error.message);
//     });
//   }, [errors, handleError]);

//   const toggleTermsModal = () => {
//     setState((prev) => ({ ...prev, showTermsModal: !prev.showTermsModal }));
//   };

//   const acceptTerms = () => {
//     setState((prev) => ({
//       ...prev,
//       isTermsAccepted: true,
//       showTermsModal: false,
//     }));
//     handleSuccess("Terms and Conditions accepted");
//   };

//   return (
//     <>
//       {state.isLoading ? (
//         <Spinner />
//       ) : (
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <input
//             {...register("firstName", { required: "First name is required" })}
//             className="border w-full px-2 text-sm rounded-md py-2"
//             placeholder="First Name"
//           />

//           <input
//             {...register("lastName", { required: "Last name is required" })}
//             placeholder="Last Name"
//             className="border w-full px-2 text-sm rounded-md py-2"
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             className="border w-full px-2 text-sm rounded-md py-2"
//             {...register("email", { required: "Email is required" })}
//             disabled={state.isOtpVerified} // Disable email input if OTP is verified
//           />
//           {!state.isOtpVerified && (
//             <div>
//               <button
//                 type="button"
//                 onClick={handleEmailValidation}
//                 disabled={state.countdown > 0}
//                 className="bg-red-600 text-white px-3 py-1 rounded-md hover:scale-105 transition-all duration-200 font-light text-sm"
//               >
//                 {state.countdown > 0
//                   ? `Resend OTP (${state.countdown}s)`
//                   : "Validate Email"}
//               </button>
//             </div>
//           )}

//           {state.isEmailSent && !state.isOtpVerified && (
//             <>
//               <input
//                 type="text"
//                 placeholder="OTP"
//                 className="border w-full px-2 text-sm rounded-md py-2"
//                 {...register("otp", {
//                   required: "OTP is required",
//                   minLength: {
//                     value: 6,
//                     message: "OTP must be at least 6 characters",
//                   },
//                 })}
//                 onChange={(e) =>
//                   setState((prev) => ({ ...prev, enteredOtp: e.target.value }))
//                 }
//               />
//               <div>
//                 <button
//                   type="button"
//                   onClick={verifyOtp}
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:scale-105 transition-all duration-200 font-light text-sm"
//                 >
//                   Verify OTP
//                 </button>
//               </div>
//             </>
//           )}

//           <input
//             type="password"
//             placeholder="Password"
//             className="border w-full px-2 text-sm rounded-md py-2"
//             {...register("password", {
//               required: "Password is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters",
//               },
//             })}
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             className="border w-full px-2 text-sm rounded-md py-2"
//             {...register("confirmPassword", {
//               required: "Please confirm your password",
//               minLength: {
//                 value: 6,
//                 message: "Confirm Password must be at least 6 characters",
//               },
//             })}
//           />

//           <input
//             type="tel"
//             className="border w-full px-2 text-sm rounded-md py-2"
//             placeholder="Phone No"
//             {...register("phone", {
//               required: "Phone number is required",
//               minLength: {
//                 value: 10,
//                 message: "Phone number must be 10 digits",
//               },
//               maxLength: {
//                 value: 10,
//                 message: "Phone number must be 10 digits",
//               },
//             })}
//           />

//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               className="h-4 w-4"
//               onChange={toggleTermsModal}
//             />
//             <span>Terms & Conditions</span>
//           </div>

//           <button
//             type="submit"
//             className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-2 hover:scale-105 transition-all duration-200"
//           >
//             SIGN UP
//           </button>
//         </form>
//       )}

//       {state.showTermsModal && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
//             <h2 className="text-2xl font-semibold mb-4">
//               Terms and Conditions
//             </h2>
//             <div className="overflow-y-auto h-64 mb-4">
//               <p>
//                 1. Introduction Welcome to VRENTAL (&quot;Company&quot;,
//                 &quot;we&quot;, &quot;our&quot;, &quot;us&quot;)! As you have
//                 just clicked to our Terms of Service, please pause, grab a cup
//                 of coffee and carefully read the following pages. It will take
//                 you approximately 20 minutes.
//               </p>
//               <p className="mt-4">
//                 2. Eligibility To use our services, you must be at least 18
//                 years of age or older. By using this Site, you represent and
//                 warrant that you have the legal capacity to enter into a binding
//                 agreement.
//               </p>
//               <p className="mt-4">
//                 3. Services Offered VRENTAL provides a platform for users to
//                 find rooms, hostels, PGs, co-living spaces, and flats for rent.
//                 We act as an intermediary between property owners and tenants.
//                 We do not own or manage any properties listed on our Site.
//               </p>
//               <p className="mt-4">
//                 4. User Responsibilities Users agree to provide accurate,
//                 current, and complete information during registration. Users
//                 must not post or transmit any false, misleading, or fraudulent
//                 information. Users are solely responsible for any content they
//                 post, upload, or transmit on our Site.
//               </p>
//               <p className="mt-4">
//                 5. Listing and Booking Property owners (&quot;Owners&quot;) must
//                 provide accurate and complete information about their
//                 properties. Tenants or users searching for properties
//                 (&quot;Tenants&quot;) must conduct their due diligence before
//                 entering into any rental agreements. VRENTAL is not responsible
//                 for any disputes or damages arising between Owners and Tenants.
//               </p>
//               <p className="mt-4">
//                 6. Fees and Payment We do not charge any additional fees for
//                 listing or booking properties through our platform. Any
//                 transaction fees or payments are to be handled directly between
//                 the Owner and the Tenant.
//               </p>
//               <p className="mt-4">
//                 7. Privacy Policy Your privacy is important to us. Please review
//                 our Privacy Policy to understand how we collect, use, and
//                 protect your personal information.
//               </p>
//               <p className="mt-4">
//                 8. Limitation of Liability VRENTAL shall not be liable for any
//                 direct, indirect, incidental, consequential, or punitive damages
//                 arising from your use of our Site or services. We do not
//                 guarantee the accuracy, completeness, or availability of any
//                 property listings.
//               </p>
//               <p className="mt-4">
//                 9. Security and User Conduct Users are responsible for
//                 maintaining the confidentiality of their account information. We
//                 reserve the right to monitor, review, and remove any content
//                 that violates these Terms or is otherwise objectionable. Any
//                 unauthorized use of the Site may result in the termination of
//                 your access.
//               </p>
//               <p className="mt-4">
//                 10. Intellectual Property Rights All content, trademarks, logos,
//                 and other intellectual property on this Site are owned by or
//                 licensed to VRENTAL. Unauthorized use is strictly prohibited.
//               </p>
//               <p className="mt-4">
//                 11. Modifications to Terms We reserve the right to modify these
//                 Terms at any time. Any changes will be effective immediately
//                 upon posting on our Site. Continued use of our Site following
//                 any changes constitutes your acceptance of the new Terms.
//               </p>
//               <p className="mt-4">
//                 12. Governing Law These Terms and Conditions shall be governed
//                 by and construed in accordance with the laws of [your
//                 jurisdiction].
//               </p>
//               <p className="mt-4">
//                 13. Contact Information For any questions or concerns regarding
//                 these Terms and Conditions, please contact us at
//                 support@vrental.in.
//               </p>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="bg-gray-400 px-4 py-2 rounded-md text-white hover:bg-gray-500 transition-all"
//                 onClick={toggleTermsModal}
//               >
//                 Close
//               </button>
//               <button
//                 className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-all"
//                 onClick={acceptTerms}
//               >
//                 Accept
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
//     </>
//   );
// }



"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../global/Spinner";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  otp: string;
  adharNo: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    isEmailSent: false,
    isLoading: false,
    countdown: 0,
    otp: "",
    enteredOtp: "",
    isOtpVerified: false,
    showTermsModal: false,
    isTermsAccepted: false,
  });

  const handleError = useCallback((message: string) => {
    toast.error(message);
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const handleEmailValidation = async () => {
    const formData = getValues();

    // Validate all required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
      handleError("Please fill in all required fields");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      handleError("Password must be at least 6 characters");
      return;
    }

    // Validate phone number
    if (formData.phone.length !== 10) {
      handleError("Phone number must be 10 digits");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data } = await axios.post("/api/auth/otp", { email: formData.email });
      if (data.success) {
        setState((prev) => ({
          ...prev,
          otp: data.otp,
          isEmailSent: true,
          isLoading: false,
        }));
        setStep(2);
        startCountdown();
        handleSuccess("OTP sent to your email");
      } else {
        handleError("Failed to send OTP");
      }
    } catch (error) {
      handleError("An error occurred while sending OTP");
      console.error("OTP Error:", error);
    }
  };

  const verifyOtp = async () => {
    if (state.otp === state.enteredOtp) {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const formData = getValues();
        const { data: responseData } = await axios.post("/api/auth/register", {
          ...formData,
          otp: state.otp,
        });

        if (responseData.success) {
          handleSuccess("Registration successful!");
          router.refresh();
        } else {
          handleError("Registration failed. Please try again.");
        }
      } catch (error) {
        handleError("Something went wrong during registration");
        console.error("Registration Error:", error);
      }
    } else {
      handleError("Invalid OTP");
    }
  };

  const startCountdown = () => {
    setState((prev) => ({ ...prev, countdown: 90 }));
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  const toggleTermsModal = useCallback(() => {
    setState((prev) => ({ ...prev, showTermsModal: !prev.showTermsModal }));
  }, []);

  const acceptTerms = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isTermsAccepted: true,
      showTermsModal: false,
    }));
    handleSuccess("Terms and Conditions accepted");
  }, [handleSuccess]);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            {...register("firstName", { required: "First name is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            placeholder="First Name"
          />
        </div>
        <div className="flex-1">
          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>
      </div>

      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
        {...register("email", { required: "Email is required" })}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />

      <input
        type="tel"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
        placeholder="Phone Number"
        {...register("phone", {
          required: "Phone number is required",
          minLength: {
            value: 10,
            message: "Phone number must be 10 digits",
          },
          maxLength: {
            value: 10,
            message: "Phone number must be 10 digits",
          },
        })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onChange={(e) => {
            if (e.target.checked) {
              toggleTermsModal();
            } else {
              setState(prev => ({ ...prev, isTermsAccepted: false }));
            }
          }}
          checked={state.isTermsAccepted}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the Terms & Conditions
        </label>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={handleEmailValidation}
          disabled={!state.isTermsAccepted}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-gray-600">Please enter the OTP sent to your email</p>
        {state.countdown > 0 && (
          <p className="text-sm text-gray-500">Resend OTP in {state.countdown}s</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
        onChange={(e) =>
          setState((prev) => ({ ...prev, enteredOtp: e.target.value }))
        }
      />

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={verifyOtp}
          disabled={!state.enteredOtp}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Verify & Submit
        </button>
      </div>

      {state.countdown === 0 && (
        <button
          type="button"
          onClick={handleEmailValidation}
          className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all duration-200"
        >
          Resend OTP
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto py-6 min-h-[400px]">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      {state.isLoading ? (
        <div className="flex justify-center items-center w-full h-full">

          <Spinner />
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </form>
      )}

      {state.showTermsModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
            <div className="overflow-y-auto h-64 mb-4">
              <p>
                1. Introduction Welcome to VRENTAL (&quot;Company&quot;,
                &quot;we&quot;, &quot;our&quot;, &quot;us&quot;)!
              </p>
              <p className="mt-4">
                2. Eligibility To use our services, you must be at least 18
                years of age or older. By using this Site, you represent and
                warrant that you have the legal capacity to enter into a binding
                agreement.
              </p>             <p className="mt-4">
                3. Services Offered VRENTAL provides a platform for users to
                find rooms, hostels, PGs, co-living spaces, and flats for rent.
                We act as an intermediary between property owners and tenants.
                We do not own or manage any properties listed on our Site.
              </p>
              <p className="mt-4">
                4. User Responsibilities Users agree to provide accurate,
                current, and complete information during registration. Users
                must not post or transmit any false, misleading, or fraudulent
                information. Users are solely responsible for any content they
                post, upload, or transmit on our Site.
              </p>
              <p className="mt-4">
                5. Listing and Booking Property owners (&quot;Owners&quot;) must
                provide accurate and complete information about their
                properties. Tenants or users searching for properties
                (&quot;Tenants&quot;) must conduct their due diligence before
                entering into any rental agreements. VRENTAL is not responsible
                for any disputes or damages arising between Owners and Tenants.
              </p>
              <p className="mt-4">
                6. Fees and Payment We do not charge any additional fees for
                listing or booking properties through our platform. Any
                transaction fees or payments are to be handled directly between
                the Owner and the Tenant.
              </p>
              <p className="mt-4">
                7. Privacy Policy Your privacy is important to us. Please review
                our Privacy Policy to understand how we collect, use, and
                protect your personal information.
              </p>
              <p className="mt-4">
                8. Limitation of Liability VRENTAL shall not be liable for any
                direct, indirect, incidental, consequential, or punitive damages
                arising from your use of our Site or services. We do not
                guarantee the accuracy, completeness, or availability of any
                property listings.
              </p>
              <p className="mt-4">
                9. Security and User Conduct Users are responsible for
                maintaining the confidentiality of their account information. We
                reserve the right to monitor, review, and remove any content
                that violates these Terms or is otherwise objectionable. Any
                unauthorized use of the Site may result in the termination of
                your access.
              </p>
              <p className="mt-4">
                10. Intellectual Property Rights All content, trademarks, logos,
                and other intellectual property on this Site are owned by or
                licensed to VRENTAL. Unauthorized use is strictly prohibited.
              </p>
              <p className="mt-4">
                11. Modifications to Terms We reserve the right to modify these
                Terms at any time. Any changes will be effective immediately
                upon posting on our Site. Continued use of our Site following
                any changes constitutes your acceptance of the new Terms.
              </p>
              <p className="mt-4">
                12. Governing Law These Terms and Conditions shall be governed
                by and construed in accordance with the laws of [your
                jurisdiction].
              </p>
              <p className="mt-4">
                13. Contact Information For any questions or concerns regarding
                these Terms and Conditions, please contact us at
                support@vrental.in.
              </p>          
              </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
                onClick={toggleTermsModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                onClick={acceptTerms}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}