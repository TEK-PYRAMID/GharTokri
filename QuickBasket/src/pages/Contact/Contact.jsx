import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`GharTokri message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <main className="bg-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-8 rounded-xl bg-[#20251f] p-8 text-white sm:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#f8c600]">
              Contact GharTokri
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-gray-200">
              Have a question about an order, a product, or your account? Send
              us a message and we’ll be glad to hear from you.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85"
            alt="Fresh vegetables at a grocery market"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>

        <div className="py-2 md:px-4 md:py-6">
          <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
          <p className="mt-2 leading-7 text-gray-600">
            Fill in the form and your email app will open with a draft ready to
            send.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d5a900] focus:ring-2 focus:ring-yellow-100"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d5a900] focus:ring-2 focus:ring-yellow-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d5a900] focus:ring-2 focus:ring-yellow-100"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#f8c600] px-6 py-3 font-bold text-gray-900 transition hover:bg-[#eab800]"
            >
              Create email draft
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
