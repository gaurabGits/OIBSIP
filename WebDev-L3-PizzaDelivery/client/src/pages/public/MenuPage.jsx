import { useState, useMemo } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { menu } from './../../services/data/menu';
import PizzaCard from './../../component/cart/PizzaCard';

const CATEGORIES = ['All', ...new Set(menu.map((item) => item.category))];

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menu;
    return menu.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("../../../images/Fireimage.png")',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black/45" />

        {/* Warm gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />

        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-amber-400">
            <UtensilsCrossed className="h-3.5 w-3.5" strokeWidth={2.5} />
            Full Menu
          </p>
          <h1 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Every pizza,
            <br />
            one <span className="text-amber-400">wood fire</span>.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-lg">
            From the classics to seasonal specials — build your order below
            and we'll have it ready in under 25 minutes.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-4 sm:px-10 lg:px-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Menu grid */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        {filteredMenu.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No pizzas in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMenu.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MenuPage;