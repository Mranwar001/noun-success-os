import { Check } from "lucide-react";

export default function SubscriptionPage() {
    const tiers = [
        {
            name: "Free Tier",
            price: "0",
            description: "Get started with the basics.",
            features: [
                "1 Course max",
                "1 TMA Analysis per week",
                "Community group access",
                "Basic study timeline",
            ],
            current: true,
        },
        {
            name: "Premium Tier",
            price: "1,500",
            description: "The ultimate tool for NOUN success.",
            features: [
                "Unlimited Courses",
                "Unlimited TMA Analysis",
                "Book Summarizer access",
                "Unlimited Mock Exams",
                "Smart Alerts & Reminders",
                "Hausa Explanation Toggle",
            ],
            current: false,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-gray-900">Choose Your Plan</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg italic">
                    "Don't study harder, study smarter with NOUN Success OS. Upgrade today to unlock your full potential."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative p-8 bg-white rounded-3xl shadow-xl transition hover:scale-[1.02] border-2 ${tier.name === 'Premium Tier' ? 'border-primary-500 shadow-primary-100' : 'border-gray-100'}`}
                    >
                        {tier.name === 'Premium Tier' && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-6 py-1 rounded-full text-sm font-bold">
                                RECOMMENDED
                            </span>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                            <p className="text-gray-500 text-sm">{tier.description}</p>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-4xl font-black text-gray-900">₦{tier.price}</span>
                                <span className="text-gray-500">/semester</span>
                            </div>
                        </div>

                        <ul className="mt-8 space-y-4">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start space-x-3 text-sm text-gray-600">
                                    <div className="p-0.5 bg-green-100 rounded-full text-green-600 mt-0.5">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`mt-8 w-full py-4 rounded-xl font-bold transition ${tier.current
                                    ? "bg-gray-100 text-gray-400 cursor-default"
                                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100"
                                }`}
                        >
                            {tier.current ? "Current Plan" : "Upgrade to Premium"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center space-y-4">
                <p className="text-sm text-gray-500 font-medium">Safe & Secure Payments via</p>
                <div className="flex items-center justify-center space-x-8 opacity-50 grayscale">
                    <span className="font-black text-2xl italic tracking-tighter">PAYSTACK</span>
                    <span className="font-black text-2xl italic tracking-tighter">STRIPE</span>
                </div>
            </div>
        </div>
    );
}
