import { Briefcase } from 'lucide-react'

export default function FooterHome() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400">Platform freelance terpercaya di Indonesia</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Untuk Freelancer</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">Cari Pekerjaan</button></li>
                <li><button className="hover:text-white transition">Cara Kerja</button></li>
                <li><button className="hover:text-white transition">Success Stories</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Untuk Client</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">Post Proyek</button></li>
                <li><button className="hover:text-white transition">Cari Freelancer</button></li>
                <li><button className="hover:text-white transition">Harga</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition">FAQ</button></li>
                <li><button className="hover:text-white transition">Kontak</button></li>
                <li><button className="hover:text-white transition">Kebijakan</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
