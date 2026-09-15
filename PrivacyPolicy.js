import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy for Corridor</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="leading-relaxed">
          Welcome to Corridor. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy explains how we collect, use, and protect your information when you use our ride-pooling 
          and solo trip mobile application across Addis Ababa.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p className="mb-2">To provide a reliable commute experience, we may collect the following data:</p>
        <ul className="list-disc pl-5 space-y-1 leading-relaxed">
          <li><strong>Account Information:</strong> Your name, phone number, and login credentials used to create your profile.</li>
          <li><strong>Location Data:</strong> Precise GPS location data to facilitate ride matching, pool sharing, and hub-to-hub pickup coordination.</li>
          <li><strong>Trip Data:</strong> Details regarding your booked solo or pool rides, preferred routes, and travel history.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
        <p className="mb-2">We use your information strictly to operate and improve the Corridor service:</p>
        <ul className="list-disc pl-5 space-y-1 leading-relaxed">
          <li>To match passengers and drivers efficiently along established transit corridors.</li>
          <li>To manage user accounts and provide customer support.</li>
          <li>To ensure platform safety, security, and smooth ride coordination.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Security & Encryption in Transit</h2>
        <p className="leading-relaxed">
          We prioritize your security. All personal data and location information transmitted between the Corridor mobile app and our servers is fully encrypted in transit using secure HTTPS/TLS protocols.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
        <p className="leading-relaxed">
          If you have any questions or concerns regarding this privacy policy or our data practices, please reach out to us at our support email.
        </p>
      </section>
    </div>
  );
}