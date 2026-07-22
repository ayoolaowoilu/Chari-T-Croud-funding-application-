'use client';

import { useState } from 'react';
import Footer from '@/app/components/layout/footer';
import NavBar from '@/app/components/layout/NavBar';

const faqs = [
  {
    question: 'What is Chari-T and what do you do?',
    answer:
      'Chari-T is a nonprofit organization dedicated to connecting donors with verified charitable causes. We carefully vet every partner organization to ensure your contributions go directly to impactful, transparent programs that create real change in communities worldwide.',
  },
  {
    question: 'How can I make a donation?',
    answer:
      'You can donate directly through our platform using credit/debit cards, bank transfers, or digital wallets like PayPal and Apple Pay. Simply browse our causes, select one that resonates with you, and follow the secure checkout process. All transactions are encrypted and tax-deductible where applicable.',
  },
  {
    question: 'Is my donation tax-deductible?',
    answer:
      'Yes. Chari-T is a registered 501(c)(3) nonprofit organization, and all donations made through our platform are tax-deductible to the fullest extent allowed by law. You will receive an official donation receipt via email immediately after your contribution.',
  },
  {
    question: 'Where does my money go?',
    answer:
      'We believe in radical transparency. On average, 92% of every dollar donated goes directly to the cause you choose. The remaining 8% covers essential operational costs like payment processing, platform maintenance, and vetting procedures. Every cause page shows a detailed breakdown of fund allocation.',
  },
  {
    question: 'Can I volunteer with Chari-T?',
    answer:
      'Absolutely. We offer both remote and in-person volunteer opportunities ranging from event coordination and content creation to direct fieldwork with our partner organizations. Visit our Volunteering page or email volunteer@chari-t.org to learn about current openings.',
  },
  {
    question: 'How do I know the causes are legitimate?',
    answer:
      'Every organization listed on Chari-T undergoes a rigorous three-stage vetting process: documentation review, financial audit, and on-the-ground verification. We publish annual impact reports and require partners to submit quarterly updates on fund usage and project outcomes.',
  },
  {
    question: 'Can I set up a recurring donation?',
    answer:
      'Yes. During checkout, you can choose to make your donation a monthly, quarterly, or annual recurring contribution. You can modify, pause, or cancel your recurring donation at any time from your account dashboard with no penalties.',
  },
  {
    question: 'How do I partner my organization with Chari-T?',
    answer:
      'We are always looking for impactful partners. Start by filling out our partnership application form on the Partners page. Our team will review your mission, financials, and operational capacity. The review process typically takes 2–3 weeks, and we will guide you through every step.',
  },
  {
    question: 'What if I need to request a refund?',
    answer:
      'If you made a donation in error or changed your mind within 30 days, contact us at support@chari-t.org with your transaction details. We handle refund requests on a case-by-case basis and aim to process them within 5–7 business days.',
  },
  {
    question: 'How can I contact your team?',
    answer:
      'You can reach us via email at hello@chari-t.org, through the contact form on our Contact page, or by connecting with us on social media. We typically respond within 24–48 hours during business days. For urgent matters, please email urgent@chari-t.org.',
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 sm:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-200 flex items-center justify-center mt-0.5 transition-all duration-200 ${
            isOpen
              ? 'bg-gray-900 border-gray-900 rotate-45'
              : 'bg-white group-hover:border-gray-300'
          }`}
        >
          <svg
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
              isOpen ? 'text-white' : 'text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5 sm:pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed pr-8 sm:pr-12">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Chari-T. Can't find what you're looking for? Reach out
            to our team.
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-8 lg:p-10 border border-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 sm:mt-14 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
            Our support team is happy to help. Send us a message and we'll get back to you within
            24–48 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors text-base"
          >
            Contact Us
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
