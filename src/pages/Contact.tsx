import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ProductContext';
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '../constants';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const Contact = () => {
  const { t } = useLanguage();
  const { addMessage } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('contact')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Have questions or need assistance? Our team is here to help you. 
          Reach out to us through any of the following channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea
                required
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <Send className="h-5 w-5" />
            </button>
          </form>
        </motion.div>

        {/* Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-2xl space-y-4">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Phone & WhatsApp</h4>
                <p className="text-sm text-gray-600">{BUSINESS_PHONE}</p>
              </div>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl space-y-4">
              <div className="bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email Address</h4>
                <p className="text-sm text-gray-600">{BUSINESS_EMAIL}</p>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl space-y-4">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Our Location</h4>
                <p className="text-sm text-gray-600">{BUSINESS_ADDRESS}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl space-y-4">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Working Hours</h4>
                <p className="text-sm text-gray-600">Mon - Sat: 8AM - 8PM</p>
                <p className="text-sm text-gray-600">Sun: 10AM - 4PM</p>
              </div>
            </div>
          </div>

          <div className="h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31899.66444857502!2d30.0401!3d-1.9441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca429ed308f77%3A0x80610336f9872f2!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1625561234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
