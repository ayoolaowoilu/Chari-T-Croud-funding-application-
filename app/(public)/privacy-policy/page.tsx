"use client"

import Explain from "@/app/components/layout/explain";
import NavBar from "@/app/components/layout/NavBar";
import Footer, { Logo } from "@/app/components/layout/footer";

export default function Page() {
  return (
    <div className="bg-white">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-16 bg-white text-gray-900">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated: May 8, 2026
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Chari-T is committed to protecting your <Explain topic="privacy" details="Your right to control how your personal information is collected, used, and shared." link="/causes/get" link_details="view causes" />. This Privacy Policy explains how we collect, use, store, and protect your <Explain topic="personal information" details="Any data that can identify you directly or indirectly, such as your name, email, or payment details." link="/causes/get" link_details="view causes" /> when you use our <Explain topic="platform" details="The Chari-T website, applications, and related services that connect donors with charitable causes." link="/causes/get" link_details="view causes" />.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using Chari-T, you consent to the practices described in this policy. If you do not agree, please do not use our <Explain topic="services" details="All features, tools, and functionalities provided by Chari-T including donation processing and cause discovery." link="/causes/get" link_details="view causes" />.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We collect information to provide and improve our services. This includes:
            </p>
            <h3 className="font-semibold text-gray-900 mt-4">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account details:</strong> Name, email address, phone number, and password when you register</li>
              <li><strong>Profile information:</strong> Photo, bio, and preferences you choose to add</li>
              <li><strong>Payment information:</strong> Credit card details and billing address processed securely by our payment partners</li>
              <li><strong>Donation history:</strong> Records of causes you support and amounts contributed</li>
              <li><strong>Communications:</strong> Messages you send to us or to charity centers through the platform</li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-4">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Device information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Usage data:</strong> Pages visited, time spent, clicks, and interactions with <Explain topic="content" details="Any material including text, images, or data available on the Chari-T platform." link="/causes/get" link_details="view causes" /></li>
              <li><strong>Location data:</strong> General geographic location based on your IP address</li>
              <li><strong>Cookies and tracking:</strong> Technologies that help us remember preferences and analyze usage</li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our <Explain topic="platform" details="The online system that enables donors to discover and contribute to charitable causes." link="/causes/get" link_details="view causes" /> and <Explain topic="services" details="All functionalities provided by Chari-T to facilitate charitable giving and cause management." link="/causes/get" link_details="view causes" /></li>
              <li>To process your <Explain topic="donations" details="Financial contributions made through Chari-T to support verified charitable causes." link="/causes/get" link_details="view causes" /> and issue receipts</li>
              <li>To verify the identity of <Explain topic="charity centers" details="Registered organizations that receive donations through our platform." link="/causes/get" link_details="view causes" /> and ensure <Explain topic="transparency" details="The clear and accurate reporting of how donations are used by recipient organizations." link="/causes/get" link_details="view causes" /></li>
              <li>To communicate with you about your account, donations, and platform updates</li>
              <li>To personalize your experience and recommend causes you may care about</li>
              <li>To analyze usage patterns and improve our platform</li>
              <li>To detect and prevent fraud, abuse, and <Explain topic="security" details="Measures taken to protect user data and platform integrity from threats." link="/causes/get" link_details="view causes" /> threats</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </div>
        </section>

        {/* Sharing Information */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We do not sell your <Explain topic="personal information" details="Data that identifies you personally, such as your name, contact details, or payment information." link="/causes/get" link_details="view causes" />. We may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>With charity centers:</strong> When you make a <Explain topic="donation" details="A financial gift given to a specific cause or organization through Chari-T." link="/causes/get" link_details="view causes" />, we share necessary details so they can acknowledge your contribution and provide updates</li>
              <li><strong>Service providers:</strong> Payment processors, hosting providers, analytics services, and email delivery services who help us operate the platform</li>
              <li><strong>Legal compliance:</strong> When required by law, court order, or to protect our rights and safety</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>
              All third parties are contractually bound to use your information only for the purposes we specify and to maintain appropriate <Explain topic="security" details="Technical and organizational protections to prevent unauthorized access to data." link="/causes/get" link_details="view causes" /> measures.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We use cookies and similar technologies to enhance your experience. These help us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Remember your login status and preferences</li>
              <li>Understand how you interact with our <Explain topic="platform" details="The Chari-T website and applications you access through your browser or device." link="/causes/get" link_details="view causes" /></li>
              <li>Deliver relevant content and recommendations</li>
              <li>Analyze traffic and improve performance</li>
            </ul>
            <p>
              You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect platform functionality.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We implement industry-standard <Explain topic="security" details="Encryption, access controls, and monitoring systems designed to protect data from breaches." link="/causes/get" link_details="view causes" /> measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure server infrastructure with regular backups</li>
              <li>Access controls limiting who can view personal data</li>
              <li>Regular security audits and vulnerability assessments</li>
            </ul>
            <p>
              While we take these precautions, no system is completely secure. We encourage you to use strong passwords and keep your <Explain topic="account" details="Your registered user profile with login credentials and associated data." link="/causes/get" link_details="view causes" /> information confidential.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your <Explain topic="personal information" details="Data associated with your identity that we store on our systems." link="/causes/get" link_details="view causes" /> for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. <Explain topic="Donation" details="Records of your financial contributions for tax and accounting purposes." link="/causes/get" link_details="view causes" /> records are typically kept for seven years to comply with financial regulations. You may request deletion of your account at any time, subject to legal obligations.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">8. Your Rights</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Depending on your location, you may have the following rights regarding your <Explain topic="personal information" details="Data that relates to you and is subject to privacy protection laws." link="/causes/get" link_details="view causes" />:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of the data we hold about you</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request removal of your data, where legally permissible</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Opt out of certain processing, such as marketing communications</li>
            </ul>
            <p>
              To exercise these rights, contact us at <strong>privacy@chari-t.org</strong>. We will respond within the timeframes required by applicable law.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Chari-T is not intended for use by individuals under the age of 16. We do not knowingly collect <Explain topic="personal information" details="Data from minors that requires parental consent under privacy laws." link="/causes/get" link_details="view causes" /> from children. If you believe we have inadvertently collected data from a minor, please contact us immediately and we will take steps to delete such information.
          </p>
        </section>

        {/* International Transfers */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, such as standard contractual clauses, to protect your <Explain topic="privacy" details="The protection of your data when it crosses international borders." link="/causes/get" link_details="view causes" /> during these transfers.
          </p>
        </section>

        {/* Policy Changes */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">11. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our <Explain topic="platform" details="The Chari-T website where this policy is always available for review." link="/causes/get" link_details="view causes" /> and updating the effective date. Continued use after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">12. Contact Us</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> privacy@chari-t.org
            </p>
            <p>
              <strong>Address:</strong> Chari-T Legal Department, 123 Charity Lane, Impact City, IC 12345
            </p>
            <p>
              <strong>Response time:</strong> We aim to respond within 48 hours
            </p>
          </div>
        </section>

        {/* Acceptance */}
        <section className="text-center p-8 border-2 border-green-200 rounded-xl bg-green-50">
          <p className="text-gray-800 font-medium text-lg">
            Your trust matters. Chari-T is committed to handling your data responsibly and transparently.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}