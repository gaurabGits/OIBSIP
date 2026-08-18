import {
  Truck,
  Flame,
  Leaf,
} from 'lucide-react';


const features = [
  {
    icon: Flame,
    title: 'Wood-Fired, Always',
    text: 'Every pizza is baked at 900°F for a crisp base and smoky edge.',
  },
  {
    icon: Truck,
    title: 'Under 25 Minutes',
    text: 'Ordered, baked, and on your doorstep before the timer runs out.',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'Locally sourced vegetables and dough made fresh every morning.',
  },
];


function FeatureSection() {
    return(
        <>
        <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-10">
            <div className="mx-auto max-w-xl text-center">
                <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-red-600">
                Why SliceHouse
                </span>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-gray-900 sm:text-4xl">
                Pizza done <span className="text-red-600">properly</span>
                </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {features.map(({ icon: Icon, title, text }) => (
                <div
                    key={title}
                    className="group rounded-2xl bg-white p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-100/60"
                >
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
                </div>
                ))}
            </div>
        </section>
        </>
    );
}

export default FeatureSection;