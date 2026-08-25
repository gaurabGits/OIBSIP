import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

function PizzaCard({ pizza }) {
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');

    const {
        pizzaImg,
        name,
        desc,
        dough,
        price,
    } = pizza;

    return (
        <div className="group w-full min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-60">
                <img
                    src={pizzaImg}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="truncate text-sm font-bold text-white sm:text-base md:text-lg">
                        {name}
                    </h3>

                    <p className="mt-1 truncate text-[10px] text-white/90 sm:text-xs">
                        {desc}
                    </p>
                </div>
            </div>

            <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">

                    <div className="min-w-0">
                        <p className="text-base font-bold text-[#171717] sm:text-lg md:text-xl">
                            Rs. {price}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-black sm:text-xs">
                            <span>{selectedSize}</span>
                            <span className="text-[#C1442D]/40">•</span>
                            <span className="truncate">{dough}</span>
                        </div>
                    </div>

                    <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-lg border border-[#C1442D]/15 bg-[#C1442D]/5 sm:h-9">

                        <button
                            type="button"
                            aria-label={`Decrease quantity of ${name}`}
                            onClick={() =>
                                setQty((current) => Math.max(1, current - 1))
                            }
                            className="grid h-full w-7 place-items-center text-black/70 transition hover:text-[#C1442D] hover:bg-[#C1442D]/10 active:scale-90 sm:w-8"
                        >
                            <Minus
                                className="h-3.5 w-3.5"
                                strokeWidth={2.5}
                            />
                        </button>

                        <span className="w-7 text-center text-xs font-bold text-black/70">
                            {qty}
                        </span>

                        <button
                            type="button"
                            aria-label={`Increase quantity of ${name}`}
                            onClick={() =>
                                setQty((current) => current + 1)
                            }
                            className="grid h-full w-7 place-items-center text-black/70 transition hover:text-[#C1442D] hover:bg-[#C1442D]/10 active:scale-90 sm:w-8"
                        >
                            <Plus
                                className="h-3.5 w-3.5"
                                strokeWidth={2.5}
                            />
                        </button>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-6 gap-1.5 sm:mt-4 sm:gap-2">
                    {SIZES.map((size) => {
                        const isSelected = size === selectedSize;

                        return (
                            <button
                                key={size}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setSelectedSize(size)}
                                className={`h-8 min-w-0 rounded-lg text-[9px] font-semibold transition sm:h-9 sm:text-[10px] ${
                                    isSelected
                                        ? 'bg-[#C1442D] text-white'
                                        : 'bg-[#C1442D]/10 text-black/70 hover:bg-[#C1442D]/15 hover:text-[#C1442D]'
                                }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C1442D] text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#A93724] hover:shadow-md active:scale-[0.98] sm:mt-4 sm:h-11 sm:text-sm"
                >
                    <ShoppingBag
                        className="h-4 w-4"
                        strokeWidth={2.5}
                    />

                    <span>Order Now</span>
                </button>
            </div>
        </div>
    );
}

export default PizzaCard;

