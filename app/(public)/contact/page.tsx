'use client';

import Footer from '@/app/components/layout/footer';
import NavBar from '@/app/components/layout/NavBar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            We&apos;d love to hear from you. Whether you have a question about our mission, want to
            partner with us, or just want to say hello — our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-5 sm:p-8 border border-gray-100 order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 sm:mb-6">
              Send us a message
            </h2>
            <form className="space-y-4 sm:space-y-5" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors text-base"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors text-base"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors text-base"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  defaultValue=""
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors appearance-none cursor-pointer text-base"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="donation">Donation Questions</option>
                  <option value="volunteer">Volunteering</option>
                  <option value="press">Press & Media</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none text-base"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors text-base sm:text-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Quick Contact Cards */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
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
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email us</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    For general inquiries
                  </p>
                  <a
                    href="mailto:hello@chari-t.org"
                    className="text-gray-900 font-medium hover:underline mt-0.5 sm:mt-1 inline-block text-sm sm:text-base truncate max-w-full"
                  >
                    hello@chari-t.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Partnerships</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    For collaboration opportunities
                  </p>
                  <a
                    href="mailto:partnerships@chari-t.org"
                    className="text-gray-900 font-medium hover:underline mt-0.5 sm:mt-1 inline-block text-sm sm:text-base truncate max-w-full"
                  >
                    partnerships@chari-t.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Support</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Need help? We&apos;re here for you
                  </p>
                  <a
                    href="mailto:support@chari-t.org"
                    className="text-gray-900 font-medium hover:underline mt-0.5 sm:mt-1 inline-block text-sm sm:text-base truncate max-w-full"
                  >
                    support@chari-t.org
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Follow us
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { name: 'Twitter', href: '#' },
                  { name: 'LinkedIn', href: '#' },
                  { name: 'Instagram', href: '#' },
                  { name: 'Facebook', href: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-900">Response time:</span> We typically
                respond to all inquiries within 24–48 hours during business days. For urgent
                matters, please email{' '}
                <a
                  href="mailto:urgent@chari-t.org"
                  className="text-gray-900 font-medium hover:underline"
                >
                  urgent@chari-t.org
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
