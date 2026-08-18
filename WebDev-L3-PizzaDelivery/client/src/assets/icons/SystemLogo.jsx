import pizzaLogo from './pizza.svg';

function SystemLogo() {
  return (
    <div className="flex shrink-0 items-center">
      <a href="/" className="group flex items-center gap-2.5">
        <span className=" relative grid h-12 w-12 place-items-center rounded-full bg-amber-50 shadow-inner transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
          <img
            src={pizzaLogo}
            alt="Pizza logo"
            className="absolute top-2 left-5 rotate-40 h-7 w-7"
          />
        </span>

        <span className="text-2xl font-extrabold tracking-wide text-[#fffaf2]">
          Slice<span className="text-amber-400">House</span>
        </span>
      </a>
    </div>
  );
}

export default SystemLogo;