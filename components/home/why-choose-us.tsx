import { Award, Compass, Gem, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Authenticity, assured",
    copy: "Every fragrance is selected with care and provenance.",
  },
  {
    icon: Compass,
    title: "A thoughtful edit",
    copy: "Discover perfumes worth returning to.",
  },
  {
    icon: Gem,
    title: "Exceptional houses",
    copy: "From established icons to independent creators.",
  },
  {
    icon: Award,
    title: "Personal guidance",
    copy: "Find a scent that feels singularly your own.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-t border-[#dcd2c3] bg-[#eae1d2]">
      <div className="page-shell grid gap-12 py-20 sm:py-24 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div>
          <p className="eyebrow">A world of distinction</p>

          <h2 className="display mt-4 text-5xl leading-[0.92] text-[#242b27] sm:text-6xl">
            More than
            <br />a fragrance.
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-7 text-[#6d756e]">
            We believe fragrance is a personal expression. Discover a considered
            collection selected for individuality and lasting impressions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-sm border border-[#d5c9b8] bg-[#f6f1e8] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#b6a58a] hover:shadow-[0_12px_30px_rgba(36,43,39,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    size={22}
                    strokeWidth={1.3}
                    className="text-[#174d3d]"
                  />

                  <span className="text-[10px] tracking-[0.15em] text-[#b6a58a]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="display mt-8 text-2xl text-[#242b27]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6d756e]">
                  {benefit.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
