import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ProductContext';
import { BUSINESS_NAME } from '../constants';
import { Facebook, Instagram, Music2, Phone, CheckCircle2, Target, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings } = useShop();
  const TEAM_MEMBERS = siteSettings.teamMembers || [];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-blue-600">{BUSINESS_NAME}</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
             IWACU EU COMPANY LTD is a dynamic and customer-focused enterprise based in Kigali, Rwanda, dedicated to providing high-quality products and services that meet modern lifestyle and business needs. The company operates across multiple sectors, with a strong emphasis on retail, general supply, and distribution of essential goods including home appliances, kitchen equipment, and lifestyle products.
Driven by a commitment to quality, affordability, and customer satisfaction, IWACU EU COMPANY LTD sources reliable products—often inspired by international standards—to ensure durability, efficiency, and value for money. The company aims to simplify everyday living by offering practical solutions that enhance comfort and convenience for households and businesses alike.
With a growing reputation in the markt.
            </p>
            <div className="space-y-4">
              {[
                "Strong customer relationships and responsive service",
                "Focus on modern, energy-efficient, and innovative products",
                "Reliable delivery and accessible pricing",
                "Commitment to integrity and professionalism in all operations"
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-gray-700 font-medium">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://ugandarwandagorillatours.com/wp-content/uploads/2019/09/Areial-View-Of-Kigali-1.jpg"
                alt="About Us"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-blue-600 p-8 rounded-3xl text-white shadow-xl hidden sm:block">
              <p className="text-4xl font-bold mb-1">10+</p>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Years Experience</p>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: <Target className="h-10 w-10 text-blue-600" />, title: "Our Mission", desc: "To provide accessible, high-quality products that enhance the lives of our customers." },
            { icon: <Users className="h-10 w-10 text-blue-600" />, title: "Our Vision", desc: "The company’s vision is to become a trusted leading supplier in Rwanda and beyond, known for delivering quality products and excellent service, while continuously adapting to the evolving needs of its customers.." },
            { icon: <Award className="h-10 w-10 text-blue-600" />, title: "Our Values", desc: "Excellence, customer satisfaction, and community growth are at the heart of everything we do." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6"
            >
              <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto">{item.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The dedicated professionals driving {BUSINESS_NAME} towards excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TEAM_MEMBERS.map((member, index) => member && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-4 uppercase tracking-wider">{member.role[language]}</p>
                  <p className="text-gray-500 text-sm italic mb-6 leading-relaxed">"{member.slogan[language]}"</p>
                  
                  <div className="flex justify-center gap-3 mb-8">
                    {member.socials.facebook && (
                      <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.tiktok && (
                      <a href={member.socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm">
                        <Music2 className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <a 
                    href={`tel:${member.phone}`}
                    className="flex items-center justify-center gap-2 text-gray-700 font-bold bg-blue-50/50 py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group/phone border border-blue-100/50 shadow-sm"
                  >
                    <Phone className="w-5 h-5 text-blue-600 group-hover/phone:text-white transition-colors" />
                    <span>Call: {member.phone}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 rounded-3xl p-12 lg:p-20 text-center text-white space-y-8">
          <h2 className="text-4xl font-bold">Ready to start shopping?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust {BUSINESS_NAME} for their daily needs.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105">
            Explore Our Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
