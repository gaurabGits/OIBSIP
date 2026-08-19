import { useState } from 'react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';

function PizzaCard({ pizza }) {
  const [qty, setQty] = useState(1);

  const {
    pizzaImg,
    name,
    desc,
    dough,
    size,
    price,
    rating = 4.8,
  } = pizza;

  return (
    <div className="group w-full max-w-[290px] overflow-hidden rounded-[28px] bg-card shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-300  hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
      
      <div className="relative m-2 h-48 overflow-hidden rounded-t-2xl">
        <img
          src={pizzaImg}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-[18px] font-bold leading-tight text-foreground">
              {name}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-[14px] text-justify tracking-normal text-xs leading-relaxed text-muted-foreground">
              {desc}
            </p>
          </div>

          <span className="shrink-0 text-[17px] font-bold text-[#C1442D]">
            {price}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-[#C1442D]/10 px-3 py-1.5 text-[12px] font-semibold text-[#C1442D]">
            {dough}
          </span>

          <span className="rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
            {size}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex h-10 items-center rounded-xl bg-muted/60">
            <button
              type="button"
              aria-label={`Decrease quantity of ${name}`}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-10 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-[#C1442D]"
            >
              <Minus
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
              />
            </button>

            <span className="w-5 text-center text-sm font-semibold text-foreground">
              {qty}
            </span>

            <button
              type="button"
              aria-label={`Increase quantity of ${name}`}
              onClick={() => setQty((q) => q + 1)}
              className="grid h-10 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-[#C1442D]"
            >
              <Plus
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Add To Cart */}
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl cursor-pointer bg-[#C1442D] text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#A93724] hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingBag
              className="h-4 w-4"
              strokeWidth={2.2}
            />

            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default PizzaCard;