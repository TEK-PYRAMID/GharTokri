const Terms = () => {
  return (
    <main className="bg-white">
      <header className="bg-[#20251f] text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#f8c600]">
            GharTokri
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            Last updated September 28, 2026
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-lg leading-8 text-gray-700">
            These terms describe the use of the GharTokri application. By
            accessing the app, you agree to use it responsibly. GharTokri is
            currently a development and demonstration project, not a live
            grocery delivery service.
          </p>

          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">Using the app</h2>
            <p className="mt-3 leading-7 text-gray-600">
              You may use the app to explore its grocery catalog and try its
              account, basket, and checkout experiences. Do not misuse the app,
              interfere with its operation, attempt unauthorized access, or use
              it in a way that violates applicable law.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Accounts and information
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              You are responsible for the information you submit and for keeping
              your sign-in details private. The current development setup is
              not intended for real passwords, payment details, or sensitive
              personal information. See the Privacy Policy for details about how
              this version handles account data.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Products, prices, and orders
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Product listings, prices, availability, basket contents, and
              checkout screens are provided for demonstration. They may be
              incomplete or inaccurate and should not be treated as an offer to
              sell or a confirmed order. Do not submit real payment information
              through this development app.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Availability and changes
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Features may change, become unavailable, or contain errors while
              the app is being developed. We may update these terms as the
              application changes. The date above indicates when this page was
              last updated.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Contact and questions
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              For questions about the app, use the Contact Us page. Its form
              prepares an email draft in your email application and does not
              send a message automatically.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
