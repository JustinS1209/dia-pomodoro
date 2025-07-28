import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      content:
        "dia-pomodoro transformed how our team works. The calendar integration is genius!",
      avatar: "👩‍💼",
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      company: "StartupXYZ",
      content:
        "Finally, a Pomodoro app that actually works for remote teams. Love the sync features.",
      avatar: "👨‍💻",
    },
    {
      name: "Elena Rodriguez",
      role: "Design Lead",
      company: "Creative Studio",
      content:
        "The analytics help us understand our productivity patterns better than ever.",
      avatar: "👩‍🎨",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            See what our users are saying about dia-pomodoro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
