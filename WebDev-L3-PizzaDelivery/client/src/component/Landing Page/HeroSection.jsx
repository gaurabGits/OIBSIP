import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Truck,
  Flame,
  Leaf,
  Star,
} from 'lucide-react';

import pizzaImg from '../../assets/images/pizza.png';
import sauceImg from '../../assets/images/sauce.png';
import cheeseImg from '../../assets/images/cheese.png';
import meatsImg from '../../assets/images/meats.png';
import herbsImg from '../../assets/images/herbs.png';
import veggiesImg from '../../assets/images/veggies.png';

/* ─── Ingredient orbit config ─────────────────────────────────────── */
const INGREDIENTS = [
  { name: 'Sauce', desc: 'San Marzano tomatoes', img: sauceImg },
  { name: 'Cheese', desc: 'Creamy mozzarella', img: cheeseImg },
  { name: 'Meats', desc: 'Pepperoni & salami', img: meatsImg },
  { name: 'Herbs', desc: 'Fresh basil & oregano', img: herbsImg },
  { name: 'Veggies', desc: 'Fresh mushrooms & peppers', img: veggiesImg },
];

const SLOT_COUNT = INGREDIENTS.length;
const SLOT_STEP = 360 / SLOT_COUNT; // 90°
const PAUSE_ANGLE = 270; // left side
const RADIUS = 300;
const STAGE = 600;
const PAUSE_MS = 3600;
const SPIN_MS = 900;
const SPIN_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/* Outer guide circle's actual position (unchanged from original layout) */
const CIRCLE_LEFT = STAGE / 2 - 30;
const CIRCLE_TOP = STAGE / 2 - RADIUS;
/* Center of that circle — the wheel orbits around THIS point, not STAGE/2 */
const CIRCLE_CENTER_X = CIRCLE_LEFT + RADIUS;
const CIRCLE_CENTER_Y = CIRCLE_TOP + RADIUS;



function HeroSection() {
    const [step, setStep] = useState(0);
    const [phase, setPhase] = useState('pause'); 
    const active = step % SLOT_COUNT;
    const isPaused = phase === 'pause';

    // Phase cycle: pause → spin → pause → spin → ...
    useEffect(() => {
        if (phase === 'pause') {
        const timer = setTimeout(() => {
            setPhase('spin');
        }, PAUSE_MS);
        return () => clearTimeout(timer);
        } else {
        const timer = setTimeout(() => {
            setPhase('pause');
            setStep((s) => s + 1);
        }, SPIN_MS);
        return () => clearTimeout(timer);
        }
    }, [phase]);

    const rotation = -step * SLOT_STEP;


    return (
        <>
        <div style={{ fontFamily: "'Manrope', sans-serif" }}>
        <style>{`
            @keyframes pz-chip-in {
            0%   { opacity: 0; transform: translate(-50%, 30px) scale(0.8); }
            100% { opacity: 1; transform: translate(-50%, 18px) scale(1); }
            }
            .pz-chip-in { animation: pz-chip-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

            @keyframes pz-pulse-ring {
            0%   { box-shadow: 0 0 0 0 rgba(193,68,45,0.4); }
            70%  { box-shadow: 0 0 0 16px rgba(193,68,45,0); }
            100% { box-shadow: 0 0 0 0 rgba(193,68,45,0); }
            }
            .pz-active-slot { animation: pz-pulse-ring 2s ease-out infinite; }

            .hero-pizza-shadow {
            filter: drop-shadow(0 20px 44px rgba(28, 23, 18, 0.20));
            }

            .btn-cusPizza { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .btn-cusPizza:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px -12px rgba(193, 68, 45, 0.4);
            }
        `}</style>

            <section
            className="relative min-h-[820px] flex flex-col overflow-hidden"
            style={{
                background: `
                radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%),
                radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%),
                #FAF6EF
                `,
            }}
            >
            <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 mt-[-100px] lg:grid-cols-[1fr_1fr] items-center gap-8 px-6 py-1 lg:py-0">
                {/* Left — Copy */}
                <div className="relative z-20 mx-10 text-center lg:text-left">
                <h1 className="font-['Fraunces'] font-extrabold text-[clamp(2.4rem,4.2vw,4rem)] leading-[1.05] tracking-tight text-[#1C1712] max-w-none lg:max-w-[28ch] mx-auto lg:mx-0">
                    Slice &amp; Bite, Pure <br />
                    <span className="text-[#C1442D]">Delight:</span>
                </h1>

                <p className="mt-4 text-[0.95rem]leading-relaxed text-[rgba(28,23,18,0.50)] max-w-[50ch] mx-auto lg:mx-0">
                    Authentic stone-baked pizza crafted with San Marzano tomatoes, creamy mozzarella, and fresh basil, delivered piping hot in{' '}
                    <span className="font-['Fraunces'] text-[1.4rem] font-medium italic text-[#1C1712]">under 25 minutes</span>.
                </p>

                <div className="mt-7 flex items-center gap-7 flex-wrap justify-center lg:justify-start">
                    <button className="btn-cusPizza bg-[#C1442D] text-white py-3.5 px-8 rounded-full font-bold text-sm tracking-wide inline-flex items-center gap-2.5 cursor-pointer shadow-[0_12px_28px_-10px_rgba(193,68,45,0.35)]">
                    Customize Your Pizza
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                    </button>
                    <button className="font-semibold text-sm text-[#1C1712] border-b-2 border-[#1C1712] pb-1 bg-transparent cursor-pointer hover:border-[#C1442D] hover:text-[#C1442D] transition-colors">
                    View Full Menu
                    </button>
                </div>

                <div className="mt-18 flex gap-16 pt-5 border-t border-[rgba(28,23,18,0.08)] max-w-[45ch] mx-auto lg:mx-0 justify-center lg:justify-start">
                    <div>
                    <b className="block text-2xl font-semibold text-[#1C1712]">4.9</b>
                    <span className="block font-semibold text-[0.6rem] tracking-[0.12em] uppercase text-[rgba(28,23,18,0.40)] mt-0.5">★ 2k+ reviews</span>
                    </div>
                    <div>
                    <b className="block text-2xl font-semibold text-[#1C1712]">20<small className="text-sm font-normal">min</small></b>
                    <span className="block font-semibold text-[0.6rem] tracking-[0.12em] uppercase text-[rgba(28,23,18,0.40)] mt-0.5">Avg. delivery</span>
                    </div>
                    <div>
                    <b className="block text-2xl font-semibold text-[#1C1712]">12</b>
                    <span className="block font-semibold text-[0.6rem] tracking-[0.12em] uppercase text-[rgba(28,23,18,0.40)] mt-0.5">Signature pies</span>
                    </div>
                </div>
                </div>

                {/* Right — Pizza Showcase */}
                <div className="relative z-10 flex items-center justify-center lg:justify-end">
                <div
                    className="relative"
                    style={{ width: STAGE, height: STAGE }}
                >
                    {/* Outer guide circle */}
                    <div
                    className="absolute rounded-full border-2 border-dashed border-[rgba(193,68,45,0.20)]"
                    style={{
                        width: RADIUS * 2,
                        height: RADIUS * 2,
                        left: CIRCLE_LEFT,
                        top: CIRCLE_TOP,
                    }}
                    />

                    {/* Pizza (fixed center) */}
                    <img
                    src={pizzaImg}
                    alt="Delicious pizza"
                    className="pz-spin-slow absolute select-none hero-pizza-shadow"
                    style={{
                        width: 550,
                        height: 550,
                        left: STAGE / 2 - [-10],
                        top: STAGE / 2 - [280],
                    }}
                    />

                    {/* Orbiting wheel */}
                    <div
                    className="absolute left-[-32px] inset-0 z-20"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: `${CIRCLE_CENTER_X}px ${CIRCLE_CENTER_Y}px`,
                        transition: `transform ${SPIN_MS}ms ${SPIN_EASE}`,
                    }}
                    >
                    {INGREDIENTS.map((ing, i) => {
                        const base = PAUSE_ANGLE + i * SLOT_STEP;
                        const isActive = i === active && isPaused;
                        return (
                        <div
                            key={ing.name}
                            className="absolute w-0 h-0"
                            style={{
                            left: CIRCLE_CENTER_X,
                            top: CIRCLE_CENTER_Y,
                            transform: `rotate(${base}deg) translateY(-${RADIUS}px)`,
                            }}
                        >
                            <div
                            style={{
                                transform: `translate(-50%, -50%) rotate(${-base - rotation}deg) scale(${isActive ? 1.16 : 1})`,
                                transition: `transform ${SPIN_MS}ms ${SPIN_EASE}`,
                            }}
                            >
                            <div
                                className={`w-[72px] h-[72px] rounded-full bg-white overflow-hidden transition-all duration-500 ${
                                isActive
                                    ? 'pz-active-slot ring-4 ring-[#C1442D]'
                                    : 'ring-2 ring-[rgba(28,23,18,0.10)]'
                                } shadow-[0_10px_28px_-8px_rgba(28,23,18,0.30)]`}
                            >
                                <img src={ing.img} alt={ing.name} className="w-full h-full object-cover" draggable={false} />
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>

                    {/* Label chip at the left pause section */}
                    <div
                    className="absolute z-30"
                    style={{ left: CIRCLE_CENTER_X - RADIUS, top: CIRCLE_CENTER_Y - [-30] }}
                    >
                    {isPaused && (
                        <div
                        key={active}
                        className="pz-chip-in flex flex-col items-center bg-white/95 backdrop-blur rounded-2xl px-5 py-2.5 shadow-[0_16px_36px_-12px_rgba(28,23,18,0.28)] border border-[rgba(193,68,45,0.20)]"
                        style={{ transform: 'translate(-50%, 20px)' }}
                        >
                        <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#C1442D]">
                            Fresh {INGREDIENTS[active].name}
                        </span>
                        <span className="text-[12px] font-medium text-[rgba(28,23,18,0.55)] whitespace-nowrap">
                            {INGREDIENTS[active].desc}
                        </span>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
            </section>
        </div>
        </>
    );
}

export default HeroSection;