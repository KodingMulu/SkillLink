import { Camera, Code, Music, Palette, PenTool, Video } from "lucide-react";

export default function CategoriesHome() {
     const categories = [
          { icon: <Code className="w-5 h-5" />, name: "Programming", count: "2.5k+" },
          { icon: <Palette className="w-5 h-5" />, name: "Design", count: "1.8k+" },
          { icon: <PenTool className="w-5 h-5" />, name: "Writing", count: "950+" },
          { icon: <Camera className="w-5 h-5" />, name: "Photography", count: "680+" },
          { icon: <Music className="w-5 h-5" />, name: "Audio", count: "420+" },
          { icon: <Video className="w-5 h-5" />, name: "Video", count: "780+" },
     ];

     return (
          <section className="py-12 px-4 bg-white">
               <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kategori Populer</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                         {categories.map((category, idx) => (
                              <button
                                   key={idx}
                                   className="p-6 bg-gray-300 rounded-xl hover:bg-gradient-to-br hover:from-green-500 hover:to-blue-600 hover:text-white transition group"
                              >
                                   <div className="text-green-500 group-hover:text-white mb-3 flex justify-center">
                                        {category.icon}
                                   </div>
                                   <div className="font-semibold text-gray-600 mb-1">{category.name}</div>
                                   <div className="text-sm text-gray-600 group-hover:text-white/80">{category.count}</div>
                              </button>
                         ))}
                    </div>
               </div>
          </section>
     )
}
