import { ArrowUpRight } from 'lucide-react';
import PizzaCard from './../cart/PizzaCard';
import { menu } from './../../services/data/menu';


function MenuSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#C1442D] text-primary">
            Fan Favorites
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            From our <span className="text-primary text-[#C1442D]">Wood-Fired </span> oven
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {menu.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex-grow text-gray-200 border-t border-border" />
            <div className="flex cursor-pointer items-center gap-2 hover:text-[#C1442D] hover:transform ease-in-out text-muted-foreground transition-colors hover:text-primary">
              <span className="py-3 text-sm font-bold tracking-wide  ">See Full Menu</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-grow text-gray-200 border-t border-border" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MenuSection;