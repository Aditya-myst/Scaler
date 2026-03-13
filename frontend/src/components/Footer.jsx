import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#131921] text-white mt-16">
            {/* Back to top */}
            <div
                className="bg-[#232F3E] text-center text-sm py-3 cursor-pointer hover:bg-[#2e3d4f] transition"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                Back to top
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <h3 className="font-bold mb-3 text-base">Get to Know Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white hover:underline">Careers</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Blog</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">About Amazon</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Investor Relations</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-3 text-base">Make Money with Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white hover:underline">Sell on Amazon</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Sell under Amazon Accelerator</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Protect and Build Your Brand</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Advertise Your Products</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-3 text-base">Amazon Payment Products</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white hover:underline">Amazon Business Card</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Shop with Points</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Reload Your Balance</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Amazon Currency Converter</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-3 text-base">Let Us Help You</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white hover:underline">Your Account</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Your Orders</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Shipping Rates & Policies</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Returns & Replacements</a></li>
                        <li><a href="#" className="hover:text-white hover:underline">Help</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-700 py-6 text-center text-gray-400 text-xs">
                <p>© 2026 Amazon Clone. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:text-white">Conditions of Use</a>
                    <a href="#" className="hover:text-white">Privacy Notice</a>
                    <a href="#" className="hover:text-white">Your Ads Privacy Choices</a>
                </div>
            </div>
        </footer>
    );
}
