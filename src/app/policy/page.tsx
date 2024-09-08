import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Effective Date: August 1, 2024
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            Welcome to VRental. We value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website, use our services, or engage with us. By using
            VRental, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            2.1 Personal Information
          </h3>
          <p className="text-gray-600 mb-4">
            When you register on our site, request information, or make a
            reservation, we may collect personal information that you provide to
            us, including but not limited to:
          </p>
          <ul className="list-disc list-inside pl-5 mb-4 text-gray-600">
            <li>
              Contact Information: Name, email address, phone number, and
              mailing address.
            </li>
            <li>
              Profile Information: Username, password, and any other details you
              provide while creating an account.
            </li>
            <li>
              Payment Information: Credit card details or other payment methods
              used for transactions.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            2.2 Usage Data
          </h3>
          <p className="text-gray-600 mb-4">
            We collect information about how you interact with our website, such
            as:
          </p>
          <ul className="list-disc list-inside pl-5 mb-4 text-gray-600">
            <li>IP Address: Your IP address and browser type.</li>
            <li>
              Device Information: Device type, operating system, and unique
              device identifiers.
            </li>
            <li>
              Usage Data: Pages you visit, time spent on those pages, and other
              usage metrics.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            2.3 Cookies and Tracking Technologies
          </h3>
          <p className="text-gray-600 mb-4">
            We use cookies and similar tracking technologies to enhance your
            experience on our website. Cookies are small files placed on your
            device that help us understand your preferences and improve our
            services. You can manage your cookie preferences through your
            browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside pl-5 mb-4 text-gray-600">
            <li>
              To Provide Services: To process your rental requests, manage
              bookings, and provide customer support.
            </li>
            <li>
              To Improve Our Website: To analyze usage patterns and improve our
              website's functionality and content.
            </li>
            <li>
              To Communicate With You: To send you updates, newsletters, and
              promotional offers related to our services, provided you have
              opted to receive them.
            </li>
            <li>
              To Process Payments: To handle payment transactions and ensure
              security.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. How We Share Your Information
          </h2>
          <ul className="list-disc list-inside pl-5 mb-4 text-gray-600">
            <li>
              <strong>With Service Providers:</strong> We may share your
              information with third-party service providers who assist us in
              operating our website and providing services, such as payment
              processors and customer support.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your
              information if required by law or in response to legal processes,
              or to protect our rights, property, or safety, or that of others.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred as part of the transaction.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Data Security
          </h2>
          <p className="text-gray-600 mb-4">
            We implement reasonable security measures to protect your personal
            information from unauthorized access, use, or disclosure. However,
            no data transmission over the internet or electronic storage is
            completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Your Rights and Choices
          </h2>
          <p className="text-gray-600 mb-4">
            <strong>Access and Update:</strong> You have the right to access and
            update your personal information. You can do this by logging into
            your account or contacting us directly.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Opt-Out:</strong> You can opt-out of receiving promotional
            communications from us by following the unsubscribe instructions in
            those communications or contacting us.
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Cookies:</strong> You can manage your cookie preferences
            through your browser settings. Please note that disabling cookies
            may affect your experience on our website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Third-Party Links
          </h2>
          <p className="text-gray-600 mb-4">
            Our website may contain links to third-party websites or services.
            We are not responsible for the privacy practices or content of these
            third parties. We encourage you to review the privacy policies of
            any third-party sites you visit.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated effective date. We
            encourage you to review this policy periodically to stay informed
            about how we are protecting your information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:
          </p>
          <p className="text-gray-700 mb-2">VRental</p>
          <p className="text-gray-700">Email: support@vrental.in</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
