import { useState, useMemo } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { menu } from './../../services/data/menu';
import PizzaCard from './../../component/cart/PizzaCard';

const CATEGORIES = ['All', ...new Set(menu.map((item) => item.category))];

function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredMenu = useMemo(() => {
        if (activeCategory === 'All') {
            return menu;
        }

        return menu.filter(
            (item) => item.category === activeCategory
        );
    }, [activeCategory]);

    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-[#FAF6EF] text-[#171717]">

            {/* ================= HERO ================= */}
            <section className="relative isolate overflow-hidden text-white">

                {/* Background */}
                <div
                    className="absolute inset-0 -z-20 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("../../../images/Fireimage.png")',
                    }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 -z-10 bg-black/50" />

                {/* Gradient */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />

                {/* Hero Content */}
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">

                    <div className="max-w-2xl">

                        <p className="mt-10 mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 sm:mb-5 sm:text-xs">
                            <UtensilsCrossed
                                className="h-3.5 w-3.5"
                                strokeWidth={2.5}
                            />

                            Full Menu
                        </p>

                        <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Every pizza,
                            <br className="hidden sm:block" />
                            one{' '}
                            <span className="text-amber-400">
                                wood fire
                            </span>
                            .
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base md:text-lg">
                            From the classics to seasonal specials.
                            Build your order below and we'll have it
                            ready in under 25 minutes.
                        </p>

                    </div>
                </div>
            </section>

            {/* ================= CATEGORY TABS ================= */}
            <section className="sticky top-0 z-20 border-b border-black/5 bg-[#FAF6EF]/95 backdrop-blur-md">

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none sm:py-4">

                        {CATEGORIES.map((category) => {
                            const isActive =
                                activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(category)
                                    }
                                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                                        isActive
                                            ? 'bg-[#C1442D] text-white shadow-sm'
                                            : 'bg-black/5 text-black/60 hover:bg-[#C1442D]/10 hover:text-[#C1442D]'
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* ================= MENU ================= */}
            <section className="w-full">

                <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

                    {filteredMenu.length === 0 ? (

                        <div className="py-16 text-center sm:py-20">
                            <p className="text-sm text-black/50 sm:text-base">
                                No pizzas in this category yet.
                            </p>
                        </div>

                    ) : (

                        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5 xl:gap-6">

                            {filteredMenu.map((pizza) => (
                                <PizzaCard
                                    key={pizza.id}
                                    pizza={pizza}
                                />
                            ))}

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}

export default MenuPage;

