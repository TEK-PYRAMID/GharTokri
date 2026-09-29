const Privacy = () => {
  return (
    <main className="bg-white">
      <header className="bg-[#20251f] text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#f8c600]">
            QuickBasket
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            Last updated September 28, 2026
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-lg leading-8 text-gray-700">
            This notice explains how the current QuickBasket application handles
            information when you browse, create an account, or use its contact
            form. QuickBasket is a development application, not a production
            grocery service.
          </p>

          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Information you provide
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              When you create an account, the app receives the name, email
              address, and password you enter. Profile image details are used
              only if they are included with the account data. Information you
              enter into the contact form is placed into an email draft in your
              device’s email application; the website does not submit that
              message to a contact server.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              How information is used
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Account information is used by the app to create an account and
              verify sign-in. Other information you provide is used to support
              the feature where you entered it, such as preparing your contact
              email draft.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Storage and sign-out
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              Account records are sent to the application’s configured user API.
              While signed in, the app stores basic profile display details in
              your browser’s local storage so your session can remain available
              after a refresh. Logging out clears that local session; it does
              not delete the account record from the application data source.
            </p>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Using this development app
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              The current development setup is not intended for real account
              credentials, payment details, or other sensitive personal
              information. Do not enter information you would not want stored
              in a local development database or browser session.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
