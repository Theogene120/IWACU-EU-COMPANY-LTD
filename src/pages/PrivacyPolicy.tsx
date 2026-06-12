import React from 'react';
import { BUSINESS_NAME, BUSINESS_EMAIL } from '../constants';

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 py-20 prose prose-blue">
    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
    <p>Last updated: April 29, 2026</p>
    <p>At {BUSINESS_NAME}, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
    
    <h2 className="text-2xl font-bold mt-12 mb-4">1. Information We Collect</h2>
    <p>We collect information you provide directly to us when you place an order, create an account, or contact us. This includes your name, email address, phone number, and delivery address.</p>
    
    <h2 className="text-2xl font-bold mt-12 mb-4">2. How We Use Your Information</h2>
    <p>We use your information to process orders, communicate with you about your delivery, and provide customer support. We may also send you promotional offers if you subscribe to our newsletter.</p>
    
    <h2 className="text-2xl font-bold mt-12 mb-4">3. Data Security</h2>
    <p>We implement industry-standard security measures to protect your data. Your payment information is processed through secure third-party payment gateways.</p>
    
    <h2 className="text-2xl font-bold mt-12 mb-4">4. Contact Us</h2>
    <p>If you have any questions about our privacy policy, please contact us at {BUSINESS_EMAIL}.</p>
  </div>
);

export default PrivacyPolicy;
