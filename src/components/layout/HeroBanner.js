import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
});

export default function HeroBanner() {
  return (
    <section className="bg-[#EAF7F2] px-6 py-24 text-center md:py-32">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-black-900">
        Doctor Intelligence Platform
      </p>

      <h1
        className={`${playfair.className} mx-auto max-w-4xl text-5xl font-normal italic leading-tight text-teal-800 md:text-7xl`}
      >
        Find the Right Doctor.
        <br />
        Make Informed Decisions.
      </h1>

      <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-black-600 md:text-lg">
        Explore doctor profiles, specialities, qualifications and
        professional experience in one place.
      </p>
    </section>
  );
}