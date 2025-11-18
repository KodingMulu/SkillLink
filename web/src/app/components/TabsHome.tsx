import { Briefcase, Clock, Heart, Star, Users } from 'lucide-react';
import React, { useState } from 'react'

export default function TabsHome() {
     const [activeTab, setActiveTab] = useState('projects');

     const projects = [
          {
               id: 1,
               title: "Website E-Commerce Modern",
               category: "Web Development",
               budget: "Rp 5.000.000 - Rp 10.000.000",
               duration: "2-3 bulan",
               description: "Membutuhkan developer untuk membuat website e-commerce dengan fitur payment gateway, dashboard admin, dan integrasi ekspedisi.",
               skills: ["React", "Node.js", "MongoDB", "Payment Gateway"],
               proposals: 12,
               postedTime: "2 jam yang lalu",
               client: {
                    name: "PT Digital Indonesia",
                    rating: 4.8,
                    reviews: 45,
                    verified: true
               }
          },
          {
               id: 2,
               title: "Logo & Brand Identity Design",
               category: "Graphic Design",
               budget: "Rp 2.000.000 - Rp 4.000.000",
               duration: "2-4 minggu",
               description: "Startup teknologi mencari designer untuk membuat logo, brand guidelines, dan asset visual lainnya.",
               skills: ["Adobe Illustrator", "Branding", "Logo Design"],
               proposals: 28,
               postedTime: "5 jam yang lalu",
               client: {
                    name: "TechStart Ventures",
                    rating: 4.9,
                    reviews: 32,
                    verified: true
               }
          },
          {
               id: 3,
               title: "Mobile App Development - iOS & Android",
               category: "Mobile Development",
               budget: "Rp 15.000.000 - Rp 25.000.000",
               duration: "3-4 bulan",
               description: "Pengembangan aplikasi mobile untuk platform ride-sharing dengan fitur real-time tracking, payment, dan rating system.",
               skills: ["React Native", "Firebase", "Google Maps API", "Socket.io"],
               proposals: 8,
               postedTime: "1 hari yang lalu",
               client: {
                    name: "Mobility Solutions",
                    rating: 5.0,
                    reviews: 67,
                    verified: true
               }
          },
          {
               id: 4,
               title: "Content Writer untuk Blog Teknologi",
               category: "Content Writing",
               budget: "Rp 500.000 - Rp 1.000.000",
               duration: "Ongoing",
               description: "Mencari content writer berpengalaman untuk menulis artikel teknologi, tutorial, dan review produk. 8-10 artikel per bulan.",
               skills: ["SEO Writing", "Tech Writing", "Research"],
               proposals: 35,
               postedTime: "3 hari yang lalu",
               client: {
                    name: "Tech Media Group",
                    rating: 4.7,
                    reviews: 89,
                    verified: true
               }
          }
     ];

     const topFreelancers = [
          {
               name: "Andi Wijaya",
               title: "Full Stack Developer",
               rating: 5.0,
               reviews: 127,
               hourlyRate: "Rp 150.000/jam",
               skills: ["React", "Node.js", "Python"],
               avatar: "AW",
               completed: 98,
               successRate: "99%"
          },
          {
               name: "Sarah Putri",
               title: "UI/UX Designer",
               rating: 4.9,
               reviews: 94,
               hourlyRate: "Rp 120.000/jam",
               skills: ["Figma", "Adobe XD", "Prototyping"],
               avatar: "SP",
               completed: 76,
               successRate: "98%"
          },
          {
               name: "Rudi Hermawan",
               title: "Mobile Developer",
               rating: 5.0,
               reviews: 82,
               hourlyRate: "Rp 140.000/jam",
               skills: ["Flutter", "React Native", "Swift"],
               avatar: "RH",
               completed: 65,
               successRate: "100%"
          }
     ];

     return (
          <section className="py-8 px-4 bg-gray-50">
               <div className="max-w-7xl mx-auto">
                    <div className="flex gap-4 mb-8 border-b">
                         <button
                              onClick={() => setActiveTab('projects')}
                              className={`pb-4 px-6 font-semibold transition ${activeTab === 'projects'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                   }`}
                         >
                              Proyek Terbaru
                         </button>
                         <button
                              onClick={() => setActiveTab('freelancers')}
                              className={`pb-4 px-6 font-semibold transition ${activeTab === 'freelancers'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                   }`}
                         >
                              Top Freelancer
                         </button>
                    </div>

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                         <div className="space-y-6">
                              {projects.map((project) => (
                                   <div key={project.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                                        <div className="flex items-start justify-between mb-4">
                                             <div className="flex-1">
                                                  <div className="flex items-center gap-3 mb-2">
                                                       <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 cursor-pointer">
                                                            {project.title}
                                                       </h3>
                                                       {project.client.verified && (
                                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                                                 Verified
                                                            </span>
                                                       )}
                                                  </div>
                                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                       <span className="flex items-center gap-1">
                                                            <Briefcase className="w-4 h-4" />
                                                            {project.category}
                                                       </span>
                                                       <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {project.postedTime}
                                                       </span>
                                                       <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {project.proposals} proposals
                                                       </span>
                                                  </div>
                                             </div>
                                             <button className="text-gray-400 hover:text-red-500 transition">
                                                  <Heart className="w-6 h-6" />
                                             </button>
                                        </div>

                                        <p className="text-gray-600 mb-4">{project.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                             {project.skills.map((skill, idx) => (
                                                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                       {skill}
                                                  </span>
                                             ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                             <div className="flex items-center gap-6">
                                                  <div>
                                                       <div className="text-sm text-gray-600">Budget</div>
                                                       <div className="font-bold text-gray-900">{project.budget}</div>
                                                  </div>
                                                  <div>
                                                       <div className="text-sm text-gray-600">Duration</div>
                                                       <div className="font-bold text-gray-900">{project.duration}</div>
                                                  </div>
                                                  <div>
                                                       <div className="text-sm text-gray-600">Client</div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">{project.client.name}</span>
                                                            <div className="flex items-center gap-1 text-yellow-400">
                                                                 <Star className="w-4 h-4 fill-current" />
                                                                 <span className="text-sm text-gray-700">{project.client.rating}</span>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                             <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
                                                  Kirim Proposal
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}

                    {/* Freelancers Tab */}
                    {activeTab === 'freelancers' && (
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {topFreelancers.map((freelancer, idx) => (
                                   <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                                        <div className="flex items-start justify-between mb-4">
                                             <div className="flex items-center gap-4">
                                                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                       {freelancer.avatar}
                                                  </div>
                                                  <div>
                                                       <h3 className="font-bold text-gray-900 text-lg">{freelancer.name}</h3>
                                                       <p className="text-gray-600 text-sm">{freelancer.title}</p>
                                                       <div className="flex items-center gap-1 mt-1">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="font-semibold text-gray-900">{freelancer.rating}</span>
                                                            <span className="text-sm text-gray-600">({freelancer.reviews})</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                             {freelancer.skills.map((skill, i) => (
                                                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                       {skill}
                                                  </span>
                                             ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                             <div>
                                                  <div className="text-sm text-gray-600">Completed</div>
                                                  <div className="font-bold text-gray-900">{freelancer.completed} jobs</div>
                                             </div>
                                             <div>
                                                  <div className="text-sm text-gray-600">Success Rate</div>
                                                  <div className="font-bold text-green-600">{freelancer.successRate}</div>
                                             </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                             <div className="font-bold text-gray-900">{freelancer.hourlyRate}</div>
                                             <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition">
                                                  Hire Now
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </section>
     )
}
