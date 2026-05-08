"use client"

import Explain from "@/app/components/layout/explain";
import NavBar from "@/app/components/layout/NavBar";
import Footer, { Logo } from "@/app/components/layout/footer";
import Image from "next/image";
import { useEffect } from "react";

const team = [
  {
    name: "Sarah Chen",
    role: "Head of Partnerships",
    bio: "Connects charities with donors and corporate sponsors worldwide.",
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    bio: "Full-stack engineer passionate about tech for social good.",
  },
  {
    name: "Aisha Patel",
    role: "Community Lead",
    bio: "Builds relationships between donors and local causes.",
  },
];

export default function Page() {
     useEffect(()=>{
             document.title = "About us | Chari-T"
        },[])
  return (
    <div className="bg-white">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-16 bg-white text-gray-900">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Chari-T</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bridging the gap between generous <Explain topic="donors" details="Individuals or organizations who contribute money, time, or resources to a cause." link="/causes/get" link_details="view causes" /> and the <Explain topic="causes" details="Charitable initiatives, campaigns, or organizations working toward a specific social good." link="/causes/get" link_details="view causes" /> that need them most.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Chari-T was built on a simple belief: everyone deserves access to help, and everyone has something to give. We created a platform where <Explain topic="donors" details="People who give money, goods, or time to support charitable work." link="/causes/get" link_details="view causes" /> can discover verified <Explain topic="charity centers" details="Registered organizations that manage and distribute aid to those in need." link="/causes/get" link_details="view causes" />, and where organizations can reach the <Explain topic="support" details="Financial donations, volunteer hours, or awareness raised for a cause." link="/causes/get" link_details="view causes" /> they need to keep doing meaningful work.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you are contributing <Explain topic="funds" details="Monetary donations transferred securely through our platform." link="/causes/get" link_details="view causes" />, <Explain topic="volunteering" details="Offering your time and skills to help a cause directly." link="/causes/get" link_details="view causes" /> your time, or spreading <Explain topic="awareness" details="Sharing information about a cause to inspire others to take action." link="/causes/get" link_details="view causes" />, Chari-T makes it easy to turn intention into <Explain topic="impact" details="The measurable positive change resulting from donations or volunteer work." link="/causes/get" link_details="view causes" />.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Discover</h3>
              <p className="text-gray-600 text-sm">
                Browse verified <Explain topic="causes" details="Charitable initiatives seeking donations or volunteer support." link="/causes/get" link_details="view causes" /> and <Explain topic="charity centers" details="Organizations that coordinate and deliver aid to communities." link="/causes/get" link_details="view causes" /> by category, location, or urgency.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">
                Learn about the <Explain topic="impact" details="Real-world outcomes and success stories from donations." link="/causes/get" link_details="view causes" />, meet the people behind the cause, and choose how to help.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Contribute</h3>
              <p className="text-gray-600 text-sm">
                <Explain topic="Donate" details="Send money securely to a cause or charity of your choice." link="/causes/get" link_details="view causes" /> securely, <Explain topic="volunteer" details="Sign up to offer your time and skills to a cause." link="/causes/get" link_details="view causes" /> your skills, or share causes with your network.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">What We Stand For</h2>
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-lg">Transparency</h3>
              <p className="text-gray-700">
                Every cause is <Explain topic="verified" details="Reviewed and approved by our team to ensure legitimacy and accountability." link="/causes/get" link_details="view causes" />. Every <Explain topic="donation" details="A financial or material gift given to support a charitable cause." link="/causes/get" link_details="view causes" /> is tracked. We believe you should know exactly where your <Explain topic="contribution" details="Any form of support given, including money, time, or resources." link="/causes/get" link_details="view causes" /> goes and who it helps.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-lg">Accessibility</h3>
              <p className="text-gray-700">
                Giving should not be complicated. We have stripped away the <Explain topic="barriers" details="Obstacles like complex forms, hidden fees, or lack of information." link="/causes/get" link_details="view causes" /> so anyone, anywhere, can support a cause in minutes.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-lg">Community</h3>
              <p className="text-gray-700">
                Chari-T is more than a <Explain topic="platform" details="An online system that connects users to services or each other." link="/causes/get" link_details="view causes" />. It is a network of people who believe in lifting each other up. <Explain topic="Donors" details="People who give to support charitable causes." link="/causes/get" link_details="view causes" />, <Explain topic="volunteers" details="Individuals who offer their time and skills without pay." link="/causes/get" link_details="view causes" />, and <Explain topic="organizations" details="Charities, nonprofits, and community groups doing social good." link="/causes/get" link_details="view causes" /> all play a part.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="mb-16 bg-gray-100 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Verified Causes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Active Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">$2M+</div>
              <div className="text-sm text-gray-600">Donations Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Partner Charities</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Meet the Team</h2>

          {/* CEO Card - Prominent */}
        <div className="mb-10 p-8 border border-gray-200 rounded-2xl bg-gray-50">
  <div className="flex flex-col md:flex-row gap-8 items-start">
    {/* Image Space */}
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-200">
        <Image
          src="/ayoola1.png"
          alt="Ayoola Khaleed Owoilu - Founder & CEO of Chari-T"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>
    </div>

    {/* CEO Info */}
    <div className="flex-1">
      <div className="mb-2">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
          Founder & CEO
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Ayoola Khaleed Owoilu</h3>

      {/* Social Links */}
      <div className="flex gap-4 mb-6">
        <a
          href="https://github.com/ayoolaowoilu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/ayoola-khaleed-owoilu-86317a340"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Ayoola is a <Explain topic="developer" details="A software engineer who designs, builds, and maintains applications and systems." link="/causes/get" link_details="view causes" /> with a deep passion for using <Explain topic="technology" details="Digital tools and platforms that enable connection and efficiency." link="/causes/get" link_details="view causes" /> to solve real-world problems. He founded Chari-T after witnessing firsthand how difficult it was for small <Explain topic="charities" details="Organizations set up to provide help and raise money for those in need." link="/causes/get" link_details="view causes" /> to reach potential <Explain topic="donors" details="People who give to support charitable causes." link="/causes/get" link_details="view causes" /> and for everyday people to find causes they could trust.
        </p>
        <p>
          With a background in full-stack development and a heart for <Explain topic="social impact" details="Positive change in communities and society through charitable action." link="/causes/get" link_details="view causes" />, Ayoola built Chari-T from the ground up as both a <Explain topic="platform" details="An online system that connects users to services or each other." link="/causes/get" link_details="view causes" /> and a movement. He believes that <Explain topic="generosity" details="The quality of being kind and giving freely to others." link="/causes/get" link_details="view causes" /> should be frictionless and that every act of giving, no matter how small, creates ripple effects of change.
        </p>
        <p>
          When he is not coding or strategizing, Ayoola mentors aspiring developers and volunteers at local community centers. His vision is simple: a world where help is always within reach.
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 italic">
          "Technology is at its best when it brings people together to do good."
        </p>
      </div>
    </div>
  </div>
</div>

          {/* Rest of Team */}
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-1">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Built for Good</h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
            Chari-T was created by a team passionate about <Explain topic="social impact" details="Positive change in communities and society through charitable action." link="/causes/get" link_details="view causes" /> and <Explain topic="technology" details="Digital tools and platforms that enable connection and efficiency." link="/causes/get" link_details="view causes" />. We are not just building software. We are building a movement where <Explain topic="generosity" details="The quality of being kind and giving freely to others." link="/causes/get" link_details="view causes" /> meets <Explain topic="opportunity" details="A chance for individuals and causes to grow and succeed." link="/causes/get" link_details="view causes" />.
          </p>
          <p className="text-gray-700">
            Ready to make a difference? Browse causes, find one that speaks to you, and take the first step toward meaningful <Explain topic="impact" details="The real, measurable change your support creates in the world." link="/causes/get" link_details="view causes" />.
          </p>
        </section>
      </main>

     <Footer />
    </div>
  );
}