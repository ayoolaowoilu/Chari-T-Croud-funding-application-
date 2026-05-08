
"use client"
import Explain from "@/app/components/layout/explain";
import NavBar from "@/app/components/layout/NavBar";
import Footer, { Logo } from "@/app/components/layout/footer";
import { useEffect } from "react";

export default function Page() {

    useEffect(()=>{
         document.title = "Terms and Conditions | Chari-T"
    },[])
  return (
    <div className="bg-white">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-16 bg-white text-gray-900">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">
            Last updated: May 8, 2026
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to Chari-T. These <Explain topic="Terms and Conditions" details="The legal agreement between you and Chari-T that governs your use of our platform and services." link="/causes/get" link_details="view causes" /> constitute a legally binding agreement between you and Chari-T regarding your access to and use of our <Explain topic="platform" details="The Chari-T website, applications, and related services that connect donors with charitable causes." link="/causes/get" link_details="view causes" />. By accessing or using Chari-T, you agree to be bound by these terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you do not agree with any part of these terms, you must not access or use our <Explain topic="services" details="All features, tools, and functionalities provided by Chari-T including donation processing and cause discovery." link="/causes/get" link_details="view causes" />. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>"Platform"</strong> refers to the Chari-T website, mobile applications, and all related <Explain topic="services" details="Digital tools and functionalities provided to users for charitable giving and cause management." link="/causes/get" link_details="view causes" />.
            </p>
            <p>
              <strong>"User"</strong> means any individual or entity that accesses or uses the Platform, including <Explain topic="donors" details="Individuals or organizations who contribute money, time, or resources to causes through our platform." link="/causes/get" link_details="view causes" />, <Explain topic="charity centers" details="Registered organizations that manage and distribute aid to those in need through Chari-T." link="/causes/get" link_details="view causes" />, and visitors.
            </p>
            <p>
              <strong>"Content"</strong> means all information, text, images, data, and other materials posted, uploaded, or transmitted through the Platform.
            </p>
            <p>
              <strong>"Donation"</strong> means any <Explain topic="contribution" details="Any form of support given through the platform, including money, time, or resources." link="/causes/get" link_details="view causes" /> made by a User to a Cause or Charity Center.
            </p>
          </div>
        </section>

        {/* User Accounts */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              To access certain features of the Platform, you must create an <Explain topic="account" details="A registered user profile that allows access to personalized features and donation history." link="/causes/get" link_details="view causes" />. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of <Explain topic="security" details="Measures and protocols designed to protect user data and prevent unauthorized access." link="/causes/get" link_details="view causes" />.
            </p>
            <p>
              We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with these Terms and Conditions or if we suspect fraudulent, abusive, or unlawful activity.
            </p>
          </div>
        </section>

        {/* Donations and Payments */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">4. Donations and Payments</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chari-T provides a <Explain topic="platform" details="An online system that facilitates transactions and connections between donors and charitable organizations." link="/causes/get" link_details="view causes" /> for making donations to verified causes. All donations are processed securely through our payment partners.
            </p>
            <p>
              By making a <Explain topic="donation" details="A voluntary financial gift given to support a charitable cause through Chari-T." link="/causes/get" link_details="view causes" />, you agree that Chari-T may deduct applicable <Explain topic="processing fees" details="Charges incurred for payment processing, platform maintenance, and operational costs." link="/causes/get" link_details="view causes" /> as disclosed at the time of donation. These fees help us maintain and improve our services.
            </p>
            <p>
              All donations are final and non-refundable unless otherwise required by law or at the sole discretion of Chari-T. We act as an intermediary and are not responsible for how recipient organizations use donated funds, though we require <Explain topic="transparency" details="The obligation of charities to report how donations are used and the impact they create." link="/causes/get" link_details="view causes" /> from our partners.
            </p>
          </div>
        </section>

        {/* Charity Centers */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">5. Charity Centers and Causes</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Organizations listed on Chari-T must meet our <Explain topic="verification" details="The process by which Chari-T confirms the legitimacy and legal status of charitable organizations." link="/causes/get" link_details="view causes" /> standards. We conduct due diligence but do not guarantee the accuracy of information provided by third-party organizations.
            </p>
            <p>
              Charity Centers are solely responsible for the accuracy of their listings, use of funds, and compliance with applicable laws. Chari-T is not liable for any misrepresentation or misuse of <Explain topic="donations" details="Financial contributions made by users to support charitable causes listed on the platform." link="/causes/get" link_details="view causes" /> by recipient organizations.
            </p>
            <p>
              We reserve the right to remove any Cause or Charity Center from the Platform that violates these terms, engages in fraudulent activity, or fails to maintain transparency standards.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">6. User Conduct</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree not to use the Platform to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Transmit any <Explain topic="harmful content" details="Material that is illegal, abusive, threatening, defamatory, or otherwise objectionable." link="/causes/get" link_details="view causes" /></li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the Platform for any fraudulent or deceptive purpose</li>
            <li>Interfere with the proper working of the Platform</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              All content, features, and functionality on the Platform, including text, graphics, logos, and software, are the exclusive property of Chari-T and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p>
              By posting <Explain topic="content" details="Any material including text, images, or data uploaded by users to the platform." link="/causes/get" link_details="view causes" /> on the Platform, you grant Chari-T a non-exclusive, royalty-free license to use, display, and distribute such content in connection with our services.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">8. Privacy and Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            Your <Explain topic="privacy" details="The protection of your personal information and control over how it is collected and used." link="/causes/get" link_details="view causes" /> is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using the Platform, you consent to our data practices as described therein. We implement reasonable <Explain topic="security" details="Technical and organizational measures to protect user data from unauthorized access or disclosure." link="/causes/get" link_details="view causes" /> measures to protect your information.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chari-T provides the Platform on an "as is" and "as available" basis. We do not warrant that the Platform will be uninterrupted, secure, or error-free.
            </p>
            <p>
              To the fullest extent permitted by law, Chari-T shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform, including but not limited to loss of <Explain topic="donations" details="Financial contributions that may be affected by technical issues, fraud, or third-party actions." link="/causes/get" link_details="view causes" />, data, or profits.
            </p>
            <p>
              Our total liability to you for any claims arising from these terms shall not exceed the amount you have paid to Chari-T in the twelve months preceding the claim.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We may terminate or suspend your <Explain topic="account" details="Your registered profile and access credentials for the Chari-T platform." link="/causes/get" link_details="view causes" /> immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will cease immediately. Provisions that by their nature should survive termination shall survive.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Chari-T operates, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the competent courts of that jurisdiction.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us at <strong>legal@chari-t.org</strong> or through our <Explain topic="support" details="Customer service and assistance provided to users regarding platform issues and inquiries." link="/causes/get" link_details="view causes" /> channels.
          </p>
        </section>

        {/* Acceptance */}
        <section className="text-center p-8 border-2 border-blue-200 rounded-xl bg-blue-50">
          <p className="text-gray-800 font-medium text-lg">
            By using Chari-T, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}