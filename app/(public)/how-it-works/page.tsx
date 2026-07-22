'use client';

import Footer from '@/app/components/layout/footer';
import NavBar from '@/app/components/layout/NavBar';

// Explain component - returns a descriptive string
function Explain({
  topic,
  details,
  link,
  link_details,
}: {
  topic: string;
  details: string;
  link: string;
  link_details: string;
}) {
  return `${topic}: ${details} [${link_details}](${link})`;
}

const safetyRanks = [
  {
    label: 'Verified Safe',
    color: 'text-emerald-600',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
    description:
      'Fully verified charity center with complete KYC, bank verification, and registration documents on file.',
  },
  {
    label: 'Likely Safe',
    color: 'text-[var(--brand)]',
    dot: 'bg-[var(--brand)]',
    ring: 'ring-[var(--brand)]/20',
    description:
      'User campaign with strong engagement signals and no reported issues. Under periodic review.',
  },
  {
    label: 'Unsure',
    color: 'text-amber-600',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    description:
      'New or low-engagement campaign. Limited verification data available. Proceed with caution.',
  },
  {
    label: 'Likely Unsafe',
    color: 'text-orange-600',
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/20',
    description:
      'Campaign flagged by community reports or algorithmic signals. Under active review by our team.',
  },
  {
    label: 'Unsafe',
    color: 'text-red-600',
    dot: 'bg-red-500',
    ring: 'ring-red-500/20',
    description:
      'Confirmed fraudulent or misleading campaign. Removed from search and donations disabled.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Click Start a Cause',
    description:
      'Find the Start a Cause button on the homepage or navigation menu to begin your campaign journey.',
  },
  {
    number: '02',
    title: 'Sign In & Verify Bank',
    description:
      "You'll be prompted to sign in to your account. New users will need to verify their bank details securely.",
  },
  {
    number: '03',
    title: 'Complete KYC',
    description:
      'Submit your identity verification through our KYC process. This helps us keep the platform safe for everyone.',
  },
  {
    number: '04',
    title: 'Create Your Cause',
    description:
      'Once verified, you can create your campaign. Add details, set a goal, upload images, and tell your story.',
  },
  {
    number: '05',
    title: 'Generate & Share',
    description:
      'Use the Generate Fliers button to create shareable assets, then spread your campaign link far and wide.',
  },
];

const centerSteps = [
  {
    number: '01',
    title: 'Go to Your Dashboard',
    description: 'Access your personal dashboard from the main navigation after signing in.',
  },
  {
    number: '02',
    title: 'Open the Menu',
    description: 'Click the menu button to reveal dashboard options including Charity Centers.',
  },
  {
    number: '03',
    title: 'Add a Center',
    description:
      'Navigate to Charity Centers and click Add Center to begin the registration process.',
  },
  {
    number: '04',
    title: 'Enter Center Details',
    description:
      "Provide your center's name, mission, location, and operational details in the centers dashboard.",
  },
  {
    number: '05',
    title: 'Verify & Register',
    description:
      'Complete bank verification and submit your registration number for official verification.',
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="shrink-0">
        <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--brand)] text-white font-bold text-sm sm:text-base">
          {number}
        </span>
      </div>
      <div className="pt-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const impactExplanation = Explain({
    topic: 'impact',
    details: 'Real-world outcomes and success stories from donations.',
    link: '/causes/get',
    link_details: 'view causes',
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-10 sm:pb-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            How Chari-T Works
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you are a donor, a fundraiser, or a charity center, here is everything you need
            to know about using our platform.
          </p>
        </section>

        {/* Starting a Cause */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Starting a Cause</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Launch your fundraising campaign in five simple steps.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 space-y-6 sm:space-y-8">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
          <div className="mt-6 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">Pro tip:</span> After creating your
              cause, click the <span className="font-medium text-gray-900">Generate Fliers</span>{' '}
              button to automatically create shareable promotional materials for your campaign. You
              will be routed to the flier generator pre-loaded with your campaign details. Copy your
              campaign link and share it anywhere.
            </p>
          </div>
        </section>

        {/* Campaign Types */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Types of Campaigns
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Not all campaigns are created equal. Here is how to tell them apart.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Charity Center Campaigns
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Created by verified nonprofit organizations and registered charity centers. These
                  campaigns have completed full bank verification, KYC, and registration checks.
                  They are marked as{' '}
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Verified Safe
                  </span>{' '}
                  by default.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  User Campaigns
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Created by individual community members. These campaigns are dynamically ranked
                  based on engagement signals, community reports, and verification status. The
                  ranking system helps donors make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Rankings - minimal text-only style */}
        <section id="ratings" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Safety Rankings</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Our automated system ranks user campaigns based on engagement and verification signals
              so you can donate with confidence.
            </p>
          </div>

          <div className="space-y-0">
            {safetyRanks.map((rank, index) => (
              <div
                key={rank.label}
                className={`flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-5 sm:py-6 ${
                  index !== safetyRanks.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-3 sm:w-40 flex-shrink-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${rank.dot} ring-4 ${rank.ring}`} />
                  <span className={`text-sm sm:text-base font-semibold ${rank.color}`}>
                    {rank.label}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:pt-0">
                  {rank.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Creating Charity Centers */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Creating a Charity Center
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Register your organization as an official charity center on Chari-T.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-200 space-y-6 sm:space-y-8">
              {centerSteps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </div>
            <div className="mt-6 p-4 sm:p-5 bg-white rounded-xl border border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Important:</span> Charity centers must
                provide a valid registration number and complete bank verification before they can
                publish campaigns. This ensures donor trust and platform integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">See the Impact</h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                {impactExplanation.split('[')[0]}
                <a
                  href="/causes/get"
                  className="inline-flex items-center gap-2 text-white font-medium hover:underline underline-offset-4 ml-1"
                >
                  view causes
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              </p>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">0%</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Platform cut</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">5</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">Safety tiers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">100%</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">To the cause*</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6">
                *Optional tips fund Chari-T. Payment processor fees may still apply via Paystack.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Quick Links</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Explore more of what Chari-T has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="/dashboard/centers/local-centers"
              className="group p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:border-gray-300 transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Find Local Charities
              </h3>
              <p className="text-sm text-gray-600">
                Discover verified charity centers in your community.
              </p>
            </a>

            <a
              href="/faq"
              className="group p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:border-gray-300 transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">FAQ</h3>
              <p className="text-sm text-gray-600">
                Answers to common questions about our platform.
              </p>
            </a>

            <a
              href="/contact"
              className="group p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:border-gray-300 transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Contact Us</h3>
              <p className="text-sm text-gray-600">Reach out to our support team for help.</p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
