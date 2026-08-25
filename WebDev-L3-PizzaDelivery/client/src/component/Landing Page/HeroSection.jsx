import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import pizzaImg from '../../assets/images/pizza.png';
import sauceImg from '../../assets/images/sauce.png';
import cheeseImg from '../../assets/images/cheese.png';
import meatsImg from '../../assets/images/meats.png';
import herbsImg from '../../assets/images/herbs.png';
import veggiesImg from '../../assets/images/veggies.png';

const INGREDIENTS = [
  {
    name: 'Sauce',
    desc: 'San Marzano tomatoes',
    img: sauceImg,
  },
  {
    name: 'Cheese',
    desc: 'Creamy mozzarella',
    img: cheeseImg,
  },
  {
    name: 'Meats',
    desc: 'Pepperoni & salami',
    img: meatsImg,
  },
  {
    name: 'Herbs',
    desc: 'Fresh basil & oregano',
    img: herbsImg,
  },
  {
    name: 'Veggies',
    desc: 'Fresh mushrooms & peppers',
    img: veggiesImg,
  },
];

const STAGE = 600;
const CENTER = STAGE / 2;

const CIRCLE_SIZE = 540;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;

const PIZZA_SIZE = 500;
const ITEM_SIZE = 72;

const ANGLE_STEP = 360 / INGREDIENTS.length;

const ROTATE_TIME = 1000;
const PAUSE_TIME = 2800;

function HeroSection() {
  const [active, setActive] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const rotateTimer = useRef(null);
  const finishTimer = useRef(null);

  useEffect(() => {
    rotateTimer.current = setTimeout(() => {
      setIsSpinning(true);

      setRotation((prev) => prev - ANGLE_STEP);

      finishTimer.current = setTimeout(() => {
        setActive((prev) => (prev + 1) % INGREDIENTS.length);
        setIsSpinning(false);
      }, ROTATE_TIME);
    }, PAUSE_TIME);

    return () => {
      clearTimeout(rotateTimer.current);
      clearTimeout(finishTimer.current);
    };
  }, [active]);

  const getIngredientPosition = (index) => {
    const angle =
      index * ANGLE_STEP -
      90 +
      rotation;

    const radians =
      (angle * Math.PI) / 180;

    const x =
      CENTER +
      CIRCLE_RADIUS *
        Math.cos(radians);

    const y =
      CENTER +
      CIRCLE_RADIUS *
        Math.sin(radians);

    return {
      x,
      y,
    };
  };

  const activePosition =
    getIngredientPosition(active);

  return (
    <section
      className="
        hero-section
        relative
        overflow-hidden
        bg-[#FAF6EF]

        pt-[76px]
        sm:pt-[84px]
        lg:pt-[88px]
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          items-center

          gap-5
          px-5
          pb-10
          pt-8

          sm:gap-8
          sm:px-8
          sm:pb-14
          sm:pt-10

          lg:grid-cols-2
          lg:gap-10
          lg:px-8
          lg:pb-20
          lg:pt-14
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-20
            text-center
            lg:text-left
          "
        >
          <h1
            className="
              font-['Fraunces']
              text-[clamp(2.2rem,5vw,3.8rem)]
              font-extrabold
              leading-[1.05]
              tracking-tight
              text-[#1C1712]
            "
          >
            Slice &amp; Bite, Pure
            <br />

            <span className="text-[#C1442D]">
              Delight:
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-[50ch]
              text-[0.95rem]
              leading-relaxed
              text-[rgba(28,23,18,0.5)]
              lg:mx-0
            "
          >
            Authentic stone-baked pizza crafted with San Marzano tomatoes,
            creamy mozzarella, and fresh basil, delivered piping hot in{' '}

            <span
              className="
                font-['Fraunces']
                text-xl
                font-medium
                italic
                text-[#1C1712]
              "
            >
              under 25 minutes
            </span>.
          </p>

          {/* BUTTONS */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              justify-center
              gap-5
              lg:justify-start
            "
          >
            <button
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#C1442D]
                px-7
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-[0_12px_28px_-10px_rgba(193,68,45,0.35)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_20px_40px_-12px_rgba(193,68,45,0.4)]
              "
            >
              Customize Your Pizza

              <ArrowUpRight
                size={17}
                strokeWidth={2.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </button>

            <button
              className="
                border-b-2
                border-[#1C1712]
                pb-1
                text-sm
                font-semibold
                text-[#1C1712]
                transition-colors
                hover:border-[#C1442D]
                hover:text-[#C1442D]
              "
            >
              View Full Menu
            </button>
          </div>

          {/* STATS */}

          <div
            className="
              mx-auto
              mt-9
              flex
              max-w-[45ch]
              justify-center
              gap-7
              border-t
              border-[rgba(28,23,18,0.08)]
              pt-5

              sm:gap-10

              lg:mx-0
              lg:justify-start
              lg:gap-12
            "
          >
            <div>
              <b
                className="
                  block
                  text-2xl
                  font-semibold
                  text-[#1C1712]
                "
              >
                4.9
              </b>

              <span
                className="
                  text-[0.6rem]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[rgba(28,23,18,0.4)]
                "
              >
                ★ 2k+ reviews
              </span>
            </div>

            <div>
              <b
                className="
                  block
                  text-2xl
                  font-semibold
                  text-[#1C1712]
                "
              >
                20
                <small className="text-sm font-normal">
                  min
                </small>
              </b>

              <span
                className="
                  text-[0.6rem]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[rgba(28,23,18,0.4)]
                "
              >
                Avg. delivery
              </span>
            </div>

            <div>
              <b
                className="
                  block
                  text-2xl
                  font-semibold
                  text-[#1C1712]
                "
              >
                12
              </b>

              <span
                className="
                  text-[0.6rem]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[rgba(28,23,18,0.4)]
                "
              >
                Signature pies
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT PIZZA
        ===================================================== */}

        <div
          className="
            pizza-showcase
            relative
            flex
            w-full
            items-center
            justify-center
            lg:justify-end
          "
        >
          <div className="pizza-stage">

            {/* OUTER CIRCLE */}

            <div className="pizza-circle" />

            {/* CENTER PIZZA */}

            <img
              src={pizzaImg}
              alt="Delicious pizza"
              className="pizza-image select-none"
              draggable={false}
            />

            {/* INGREDIENT ORBIT */}

            <div
              className="ingredient-wheel"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {INGREDIENTS.map(
                (ingredient, index) => {
                  const angle =
                    index * ANGLE_STEP -
                    90;

                  const radians =
                    (angle * Math.PI) / 180;

                  const x =
                    CENTER +
                    CIRCLE_RADIUS *
                      Math.cos(radians);

                  const y =
                    CENTER +
                    CIRCLE_RADIUS *
                      Math.sin(radians);

                  const isActive =
                    index === active &&
                    !isSpinning;

                  return (
                    <div
                      key={ingredient.name}
                      className="ingredient"
                      style={{
                        left:
                          x -
                          ITEM_SIZE / 2,

                        top:
                          y -
                          ITEM_SIZE / 2,

                        transform:
                          `rotate(${-rotation}deg)`,
                      }}
                    >
                      <div
                        className={`
                          ingredient-inner
                          ${
                            isActive
                              ? 'active'
                              : ''
                          }
                        `}
                      >
                        <img
                          src={ingredient.img}
                          alt={ingredient.name}
                          draggable={false}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* ACTIVE INGREDIENT LABEL */}

            {!isSpinning && (
              <div
                className="active-label"
                style={{
                  left:
                    activePosition.x,

                  top:
                    activePosition.y +
                    ITEM_SIZE / 2 +
                    18,
                }}
              >
                <div className="label-line">
                  <span />
                </div>

                <div className="label-card">
                  <div className="label-dot" />

                  <div>
                    <div className="label-title">
                      Fresh{' '}
                      {INGREDIENTS[active].name}
                    </div>

                    <div className="label-desc">
                      {INGREDIENTS[active].desc}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ================================================
           STAGE
        ================================================= */

        .pizza-stage {
          position: relative;

          width: 600px;
          height: 600px;

          flex-shrink: 0;
        }


        /* ================================================
           OUTER CIRCLE
        ================================================= */

        .pizza-circle {
          position: absolute;

          width: ${CIRCLE_SIZE}px;
          height: ${CIRCLE_SIZE}px;

          left: 30px;
          top: 30px;

          border:
            2px dashed
            rgba(193, 68, 45, 0.2);

          border-radius: 50%;

          z-index: 1;
        }


        /* ================================================
           PIZZA
        ================================================= */

        .pizza-image {
          position: absolute;

          width: ${PIZZA_SIZE}px;
          height: ${PIZZA_SIZE}px;

          left: 50px;
          top: 50px;

          object-fit: contain;

          z-index: 2;

          pointer-events: none;

          filter:
            drop-shadow(
              0 20px 44px
              rgba(28, 23, 18, 0.2)
            );
        }


        /* ================================================
           ORBIT
        ================================================= */

        .ingredient-wheel {
          position: absolute;

          inset: 0;

          width: 600px;
          height: 600px;

          z-index: 10;

          transform-origin:
            center center;

          transition:
            transform ${ROTATE_TIME}ms
            cubic-bezier(
              0.35,
              0,
              0.2,
              1
            );

          will-change: transform;
        }


        /* ================================================
           INGREDIENT
        ================================================= */

        .ingredient {
          position: absolute;

          width: ${ITEM_SIZE}px;
          height: ${ITEM_SIZE}px;

          transform-origin:
            center center;

          will-change: transform;
        }


        /* ================================================
           INGREDIENT INNER
        ================================================= */

        .ingredient-inner {
          position: relative;

          width: ${ITEM_SIZE}px;
          height: ${ITEM_SIZE}px;

          overflow: hidden;

          border-radius: 50%;

          background: white;

          border:
            2px solid
            rgba(28, 23, 18, 0.1);

          box-shadow:
            0 10px 28px -8px
            rgba(28, 23, 18, 0.3);

          transition:
            transform 450ms
              cubic-bezier(
                0.2,
                0.8,
                0.2,
                1
              ),
            border-color 350ms ease,
            box-shadow 350ms ease;
        }


        /* ================================================
           ACTIVE INGREDIENT
        ================================================= */

        .ingredient-inner.active {
          transform:
            scale(1.18);

          border:
            4px solid
            #C1442D;

          box-shadow:
            0 12px 30px -8px
            rgba(28, 23, 18, 0.3),

            0 0 0 8px
            rgba(193, 68, 45, 0.08),

            0 0 30px
            rgba(193, 68, 45, 0.16);

          animation:
            ingredientGlow 2s
            ease-in-out infinite;
        }


        /* ================================================
           INGREDIENT IMAGE
        ================================================= */

        .ingredient-inner img {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;

          transform: none !important;

          user-select: none;

          pointer-events: none;
        }


        /* ================================================
           ACTIVE LABEL
        ================================================= */

        .active-label {
          position: absolute;

          z-index: 30;

          width: max-content;

          transform:
            translateX(-50%);

          pointer-events: none;

          transition:
            left ${ROTATE_TIME}ms
              cubic-bezier(
                0.35,
                0,
                0.2,
                1
              ),

            top ${ROTATE_TIME}ms
              cubic-bezier(
                0.35,
                0,
                0.2,
                1
              );

          animation:
            labelEnter 450ms
            cubic-bezier(
              0.2,
              0.8,
              0.2,
              1
            );
        }


        /* ================================================
           CONNECTOR
        ================================================= */

        .label-line {
          display: flex;

          justify-content: center;

          height: 18px;
        }


        .label-line span {
          position: relative;

          width: 1px;

          height: 18px;

          background:
            linear-gradient(
              to bottom,
              rgba(193, 68, 45, 0.7),
              rgba(193, 68, 45, 0.1)
            );
        }


        .label-line span::before {
          content: '';

          position: absolute;

          left: 50%;
          top: 0;

          width: 6px;
          height: 6px;

          border-radius: 50%;

          transform:
            translate(-50%, -50%);

          background:
            #C1442D;

          box-shadow:
            0 0 0 4px
            rgba(193, 68, 45, 0.08);
        }


        /* ================================================
           LABEL CARD
        ================================================= */

        .label-card {
          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 185px;

          padding:
            10px 15px;

          border:
            1px solid
            rgba(193, 68, 45, 0.16);

          border-radius: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          box-shadow:
            0 18px 45px
            rgba(28, 23, 18, 0.14),

            0 4px 12px
            rgba(28, 23, 18, 0.06);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);
        }


        /* ================================================
           LABEL DOT
        ================================================= */

        .label-dot {
          width: 8px;
          height: 8px;

          flex-shrink: 0;

          border-radius: 50%;

          background:
            #C1442D;

          box-shadow:
            0 0 0 5px
            rgba(193, 68, 45, 0.08);
        }


        /* ================================================
           LABEL TEXT
        ================================================= */

        .label-title {
          font-size: 10px;

          font-weight: 800;

          line-height: 1.2;

          text-transform: uppercase;

          letter-spacing: 0.16em;

          color:
            #C1442D;
        }


        .label-desc {
          margin-top: 3px;

          font-size: 11px;

          font-weight: 500;

          line-height: 1.3;

          white-space: nowrap;

          color:
            rgba(
              28,
              23,
              18,
              0.55
            );
        }


        /* ================================================
           GLOW ANIMATION
        ================================================= */

        @keyframes ingredientGlow {

          0%,
          100% {
            box-shadow:
              0 12px 30px -8px
              rgba(28, 23, 18, 0.3),

              0 0 0 8px
              rgba(193, 68, 45, 0.08),

              0 0 20px
              rgba(193, 68, 45, 0.08);
          }

          50% {
            box-shadow:
              0 12px 30px -8px
              rgba(28, 23, 18, 0.3),

              0 0 0 10px
              rgba(193, 68, 45, 0.05),

              0 0 34px
              rgba(193, 68, 45, 0.18);
          }
        }


        /* ================================================
           LABEL ENTRY
        ================================================= */

        @keyframes labelEnter {

          0% {
            opacity: 0;

            transform:
              translateX(-50%)
              translateY(8px)
              scale(0.94);
          }

          100% {
            opacity: 1;

            transform:
              translateX(-50%)
              translateY(0)
              scale(1);
          }
        }


        /* ================================================
           TABLET
        ================================================= */

        @media (max-width: 1023px) {

          .pizza-showcase {
            width: 100%;
            overflow: visible;
          }

          .pizza-stage {
            transform:
              scale(0.82);

            transform-origin:
              center center;

            margin-top: -25px;
            margin-bottom: -25px;
          }
        }


        /* ================================================
           MOBILE
        ================================================= */

        @media (max-width: 640px) {

          .hero-section {
            overflow: hidden;
          }

          .pizza-showcase {
            width: 100%;
            overflow: visible;
          }

          .pizza-stage {
            transform:
              scale(0.58);

            transform-origin:
              center center;

            margin-top: -65px;
            margin-bottom: -65px;
          }
        }


        /* ================================================
           SMALL MOBILE
        ================================================= */

        @media (max-width: 400px) {

          .pizza-stage {
            transform:
              scale(0.52);

            transform-origin:
              center center;

            margin-top: -75px;
            margin-bottom: -75px;
          }
        }


        /* ================================================
           REDUCED MOTION
        ================================================= */

        @media (prefers-reduced-motion: reduce) {

          .ingredient-wheel,
          .active-label {
            transition: none;
          }

          .ingredient-inner.active {
            animation: none;
          }
        }

      `}</style>
    </section>
  );
}

export default HeroSection;