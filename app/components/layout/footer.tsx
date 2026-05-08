import { Heart, Mail, Phone, MapPin, ArrowUp, Leaf, ExternalLink } from 'lucide-react';

const footerLinks = {
    causes: [
        { name: 'Education', href: `/causes/get?category=Education` },
        { name: 'Healthcare', href: `/causes/get?category=Health` },
        { name: 'Food Security', href: `/causes/get?category=Education` },
        { name: 'Emergency Relief', href: `/causes/get?category=Community` }
    ],
    company: [
        { name: 'About Us', href: '#' },
        { name: 'Our Team', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' }
    ],
    resources: [
        { name: 'Blog', href: '#' },
        { name: 'Reports', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Contact', href: '#' }
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' }
    ]
};

 const Logo:React.FC<{nav?:boolean}> =({ nav })=> {
    return (
        <div className="flex items-center gap-3">
            <div className={`${"w-10 h-10"} bg-gray-900 rounded-xl flex items-center justify-center shadow-sm`}>
                <Leaf size={nav ? 15 : 20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className={`${nav ? "text-xl" : "text-2xl"} font-bold text-gray-900 tracking-tight`}>Chari-T</span>
        </div>
    );
}
export { Logo }

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-50 text-gray-600">
            {/* Top CTA Block */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-0">
                <div className="bg-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to make an impact?</h3>
                        <p className="text-gray-400">Join thousands of donors changing lives every day.</p>
                    </div>
                    <button className="relative z-10 px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                        Start Giving Today
                    </button>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Brand Block - Large */}
                    <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                        <div className="mb-6">
                            <Logo />
                        </div>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Connecting compassionate donors with communities in need. 
                            Transparent, secure, and impactful giving that creates real change.
                        </p>
                        
                        {/* Contact Cards */}
                        <div className="space-y-3">
                            <a href="mailto:hello@chari-t.org" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Mail size={18} className="text-gray-700" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</div>
                                    <div className="text-sm font-medium text-gray-900">hello@chari-t.org</div>
                                </div>
                            </a>
                            
                            <a href="tel:+1234567890" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Phone size={18} className="text-gray-700" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</div>
                                    <div className="text-sm font-medium text-gray-900">+1 (234) 567-890</div>
                                </div>
                            </a>
                            
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <MapPin size={18} className="text-gray-700" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Location</div>
                                    <div className="text-sm font-medium text-gray-900">123 Hope Street, NY 10001</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid Block */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Causes</h4>
                            <ul className="space-y-3.5">
                                {footerLinks.causes.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
                            <ul className="space-y-3.5">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-3.5">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Legal</h4>
                            <ul className="space-y-3.5">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Block */}
                    <div className="lg:col-span-3 bg-gray-900 rounded-2xl p-8 text-white flex flex-col justify-between shadow-sm">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Get impact stories and updates delivered to your inbox weekly.
                            </p>
                        </div>
                        
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600 transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                Subscribe
                                <ExternalLink size={14} />
                            </button>
                        </form>
                        
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>No spam, ever.</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span>Unsubscribe anytime.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        
                        {/* Copyright */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>© 2024 Chari-T.</span>
                            <Heart size={14} className="text-gray-300 fill-gray-300" />
                            <span>Made for a better world.</span>
                        </div>

                        {/* Scroll Top */}
                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}