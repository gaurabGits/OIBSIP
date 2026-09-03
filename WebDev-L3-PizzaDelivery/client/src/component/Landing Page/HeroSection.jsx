import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom"
import { ArrowUpRight } from 'lucide-react';

import pizzaImg from '../../assets/images/pizza.png';
import sauceImg from '../../assets/images/sauce.png';
import cheeseImg from '../../assets/images/cheese.png';
import meatsImg from '../../assets/images/meats.png';
import herbsImg from '../../assets/images/herbs.png';
import veggiesImg from '../../assets/images/veggies.png';

const INGREDIENTS = [
  { name: 'Sauce', desc: 'San Marzano tomatoes', img: sauceImg },
  { name: 'Cheese', desc: 'Creamy mozzarella', img: cheeseImg },
  { name: 'Meats', desc: 'Pepperoni & salami', img: meatsImg },
  { name: 'Herbs', desc: 'Fresh basil & oregano', img: herbsImg },
  { name: 'Veggies', desc: 'Fresh mushrooms & peppers', img: veggiesImg },
];

const STAGE = 600;
const CENTER = STAGE / 2;
const CIRCLE_SIZE = 540;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
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
    const angle = index * ANGLE_STEP - 90 + rotation;
    const radians = (angle * Math.PI) / 180;

    return {
      x: CENTER + CIRCLE_RADIUS * Math.cos(radians),
      y: CENTER + CIRCLE_RADIUS * Math.sin(radians),
    };
  };

  const activePosition = getIngredientPosition(active);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Slice &amp; Bite, Pure
            <br />
            <span>Delight:</span>
          </h1>

          <p className="hero-description">
            Authentic stone-baked pizza crafted with San Marzano tomatoes,
            creamy mozzarella, and fresh basil, delivered piping hot in{' '}
            <span className="time-hero">under 25 minutes</span>.
          </p>

          <div className="hero-buttons">
            <button className="hero-primary-btn" type="button" data-scroll-target="menu">
              Customize Your Pizza
              <ArrowUpRight size={17} strokeWidth={2.5} />
            </button>

            <Link 
              to="/menu"
              className="hero-menu-btn">
              View Full Menu
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <b>4.9</b>
              <span>★ 2k+ reviews</span>
            </div>

            <div className="hero-stat">
              <b>
                20 <small>min</small>
              </b>
              <span>Avg. delivery</span>
            </div>

            <div className="hero-stat">
              <b>12</b>
              <span>Signature pies</span>
            </div>
          </div>
        </div>

        <div className="pizza-showcase">
          <div className="pizza-stage">
            <div className="pizza-circle" />

            <img
              src={pizzaImg}
              alt="Delicious pizza"
              className="pizza-image"
              draggable={false}
            />

            <div className="ingredient-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
              {INGREDIENTS.map((ingredient, index) => {
                const angle = index * ANGLE_STEP - 90;
                const radians = (angle * Math.PI) / 180;

                const x = CENTER + CIRCLE_RADIUS * Math.cos(radians);
                const y = CENTER + CIRCLE_RADIUS * Math.sin(radians);

                const isActive = index === active && !isSpinning;

                return (
                  <div
                    key={ingredient.name}
                    className="ingredient"
                    style={{
                      left: x - ITEM_SIZE / 2,
                      top: y - ITEM_SIZE / 2,
                      transform: `rotate(${-rotation}deg)`,
                    }}
                  >
                    <div className={`ingredient-inner ${isActive ? 'active' : ''}`}>
                      <img src={ingredient.img} alt={ingredient.name} draggable={false} />
                    </div>
                  </div>
                );
              })}
            </div>

            {!isSpinning && (
              <div className="active-label" style={{ left: activePosition.x, top: activePosition.y + ITEM_SIZE / 2 + 18 }}>
                <div className="label-line">
                  <span />
                </div>

                <div className="label-card">
                  <div className="label-dot" />

                  <div>
                    <div className="label-title">
                      Fresh {INGREDIENTS[active].name}
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
    </section>
  );
}

export default HeroSection;
