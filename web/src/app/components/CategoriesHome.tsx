import { Camera, Code, Music, Palette, PenTool, Video } from "lucide-react";

export default function CategoriesHome() {
     const categories = [
          { icon: Code, name: "Programming", count: "2.5k+" },
          { icon: Palette, name: "Design", count: "1.8k+" },
          { icon: PenTool, name: "Writing", count: "950+" },
          { icon: Camera, name: "Photography", count: "680+" },
          { icon: Music, name: "Audio", count: "420+" },
          { icon: Video, name: "Video", count: "780+" },
     ];

     return (
          <section className="py-20 px-4 bg-gradient-to-b from-white via-[#F8FBFF] to-[#EEF4FF]">
               <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                         Kategori Populer
                    </h2>

                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                         {categories.map((category) => {
                              const Icon = category.icon;
                              return (
                                   <li key={category.name}>
                                        <button 
                                             className="w-full p-6 bg-white rounded-xl border border-gray-100 
                                             shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 group"
                                        >
                                             <Icon className="w-6 h-6 text-green-500 group-hover:text-green-600 mb-3 mx-auto" />

                                             <p className="font-semibold text-gray-800 group-hover:text-gray-900">
                                                  {category.name}
                                             </p>

                                             <p className="text-sm text-gray-500">
                                                  {category.count}
                                             </p>
                                        </button>
                                   </li>
                              );
                         })}
                    </ul>
               </div>
          </section>
     );
}
