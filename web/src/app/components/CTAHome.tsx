import React from 'react'

export default function CTAHome() {
     return (
          <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-blue-600">
               <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                         Mulai Karirmu sebagai Freelancer!
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                         Bergabunglah dengan ribuan freelancer sukses dan dapatkan proyek impianmu
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-200 shadow-lg">
                              Daftar sebagai Freelancer
                         </button>
                         <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition">
                              Post Proyek Gratis
                         </button>
                    </div>
               </div>
          </section>
     )
}
