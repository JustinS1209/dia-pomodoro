import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <h2 className="text-5xl font-bold leading-tight">
          Ready to Transform Your
          <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Team's Productivity?
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join thousands of teams already using dia-pomodoro to focus better and
          achieve more together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-gradient-to-r from-red-500 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <span>Start Your Free Trial</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <span className="text-gray-400">No credit card required</span>
        </div>
      </div>
    </section>
  );
};
