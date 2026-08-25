import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PizzaCard from './../cart/PizzaCard';
import { menu } from './../../services/data/menu';

function MenuSection() {
    return (
        <section className="w-full overflow-hidden bg-[#FAF6EF] py-12 sm:py-16 md:py-20">

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C1442D] sm:text-xs">
                        Fan Favorites
                    </span>

                    <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#171717] sm:mt-3 sm:text-3xl md:text-4xl">
                        From our{' '}
                        <span className="text-[#C1442D]">
                            Wood-Fired
                        </span>{' '}
                        oven
                    </h2>
                </div>

                {/* Pizza Grid */}
                <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-4 lg:gap-5 xl:gap-6">
                    {menu.map((pizza) => (
                        <PizzaCard
                            key={pizza.id}
                            pizza={pizza}
                        />
                    ))}
                </div>

                {/* Full Menu */}
                <div className="mt-8 sm:mt-12">
                    <div className="flex w-full items-center gap-3 sm:gap-5">

                        <div className="h-px flex-1 bg-gray-200" />

                        <Link
                            to="/menu"
                            className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-gray-600 transition-colors duration-200 hover:text-[#C1442D] sm:gap-2 sm:text-sm"
                        >
                            <span>See Full Menu</span>

                            <ArrowUpRight
                                size={15}
                                strokeWidth={2.5}
                                className="sm:h-4 sm:w-4"
                            />
                        </Link>

                        <div className="h-px flex-1 bg-gray-200" />

                    </div>
                </div>

            </div>
        </section>
    );
}

export default MenuSection;
