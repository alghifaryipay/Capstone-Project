import {
  Brain,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Brain />,
    title: "AI Prediction",
    desc: "Forecast future electricity usage using AI models.",
  },
  {
    icon: <BarChart3 />,
    title: "Smart Analytics",
    desc: "Visualize consumption trends in real-time.",
  },
  {
    icon: <ShieldCheck />,
    title: "Energy Optimization",
    desc: "Reduce electricity bills with AI insights.",
  },
];

function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-medium">
          FEATURES
        </p>

        <h1 className="text-5xl font-bold mt-4">
          Everything You Need
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[32px] p-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {item.icon}
            </div>

            <h2 className="text-2xl font-semibold mt-8">
              {item.title}
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;