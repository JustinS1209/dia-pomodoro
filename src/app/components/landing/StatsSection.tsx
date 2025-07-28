import { CheckCircle, Clock, Star, Users } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    { number: "500K+", label: "Active Users", icon: Users },
    { number: "50M+", label: "Focus Sessions", icon: Clock },
    { number: "99.9%", label: "Uptime", icon: CheckCircle },
    { number: "4.9★", label: "User Rating", icon: Star },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-red-500 to-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-white space-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">{stat.number}</div>
              <div className="text-red-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
