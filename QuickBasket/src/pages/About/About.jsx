import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-white text-gray-900">
      <section className="bg-[#fff8dc]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
              About QuickBasket
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Good food, made easier.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-gray-700">
              We make everyday grocery shopping simple. Find fresh produce,
              pantry staples, and household essentials in one place, then get
              them delivered straight to your door.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex rounded-lg bg-[#f8c600] px-6 py-3 font-bold text-gray-900 transition hover:bg-[#eab800]"
            >
              Shop groceries
            </Link>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh colorful produce arranged at a grocery market"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg"
            />
            <div className="absolute -bottom-4 left-4 max-w-xs rounded-lg bg-white px-5 py-4 shadow-md sm:left-8">
              <p className="font-bold text-gray-900">Everyday essentials</p>
              <p className="mt-1 text-sm text-gray-600">
                Picked for your routine, ready for your basket.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-700">
              Our approach
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">
              A better kind of grocery run.
            </h2>
          </div>
          <p className="text-lg leading-8 text-gray-600">
            Shopping for the things you need should fit naturally into your day.
            QuickBasket brings your grocery list together in a straightforward
            experience, so you can spend less time sorting out the shop and more
            time on what matters at home.
          </p>
        </div>

        <div className="mt-12 grid gap-8 border-t border-gray-200 pt-8 sm:grid-cols-3">
          <article>
            <span className="text-2xl font-extrabold text-yellow-600">01</span>
            <h3 className="mt-3 text-lg font-bold">Fresh choices</h3>
            <p className="mt-2 leading-7 text-gray-600">
              Browse produce and everyday favorites together in one place.
            </p>
          </article>
          <article>
            <span className="text-2xl font-extrabold text-yellow-600">02</span>
            <h3 className="mt-3 text-lg font-bold">Simple shopping</h3>
            <p className="mt-2 leading-7 text-gray-600">
              Find what you need, add it to your basket, and check out with ease.
            </p>
          </article>
          <article>
            <span className="text-2xl font-extrabold text-yellow-600">03</span>
            <h3 className="mt-3 text-lg font-bold">At your doorstep</h3>
            <p className="mt-2 leading-7 text-gray-600">
              Get your order delivered, without making another trip to the store.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;
