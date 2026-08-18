import { ArrowUpRight } from 'lucide-react';

const MENU_ITEMS = [
  { pizzaImg: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_1280.jpg", name: 'Margherita Classic', desc: 'Tomato, mozzarella, fresh basil', price: '$12' },
  { pizzaImg: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_1280.jpg", name: 'Pepperoni Supreme', desc: 'Double pepperoni, mozzarella, oregano', price: '$14' },
  { pizzaImg: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_1280.jpg", name: 'Wild Mushroom', desc: 'Truffle oil, mushroom blend, thyme', price: '$15' },
  { pizzaImg: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_1280.jpg", name: 'Diavola', desc: 'Spicy salami, chili flakes, honey drizzle', price: '$15' },
];

function MenuSection() {
    return (
        <>
        <section className="bg-[#FAF6EF] py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="mx-auto max-w-xl text-center">
              <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-red-600">
                Fan Favorites
              </span>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
                From our <span className="text-red-600">wood-fired oven</span>
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MENU_ITEMS.map(({ pizzaImg, name, desc, price }) => (
                <div
                  key={name}
                  className="group rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-100/60"
                >
                  <div className="relative h-40 overflow-hidden bg-[#F3ECE0]">
                    <img
                      src={pizzaImg}
                      alt={name}
                      className="w-full h-full object-cover scale-125 transition-transform duration-500 group-hover:scale-[1.35]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                      <span className="shrink-0 text-sm font-bold text-red-600">{price}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
                <div className="flex items-center justify-center gap-2 ">
                    <div className="flex-grow border-t border-gray-300"></div>
                        <div className="flex text-gray-600 items-center gap-2 cursor-pointer">
                            <span className="py-3  font-bold text-sm tracking-wide ">
                                See Full Menu
                            </span>
                            <ArrowUpRight size={16} strokeWidth={2.5} />
                        </div>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
    
          </div>
        </section>
        </>
    );
}

export default MenuSection;