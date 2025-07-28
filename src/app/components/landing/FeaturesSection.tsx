import { BarChart3, Brain, Calendar, Users } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar Integration",
      description:
        "Automatically schedules meetings between Pomodoro cycles and syncs with your team's availability.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Team Sync Sessions",
      description:
        "Work together in synchronized focus sessions with your team members across different time zones.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track productivity patterns, focus time, and team performance with detailed insights.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations to optimize your focus sessions and productivity.",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to focus better and collaborate more effectively
            with your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
