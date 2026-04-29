import Button from "../components/ui/Button";
import { logOutUser } from "../features/auth/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Dashboard() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleSurprise = () => {
    setShowSurprise(true);
    // Create floating hearts animation
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        setFloatingHearts((prev) => [
          ...prev,
          {
            id: Date.now() + i,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight - 100,
          },
        ]);
      }, i * 80);
    }
    // Remove hearts after animation
    setTimeout(() => {
      setFloatingHearts([]);
    }, 3000);
  };

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logOutUser();
    navigate("/");
  };

  return (
    <>
      <Button variant="secondary" onClick={handleLogOut}>
        LOG OUT
      </Button>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 relative overflow-hidden flex items-center justify-center">
        {/* Floating background hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300 opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 10}s`,
                fontSize: `${15 + Math.random() * 35}px`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Animated hearts on surprise */}
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="fixed pointer-events-none animate-floatUp"
            style={{
              left: heart.x,
              bottom: 0,
              fontSize: "28px",
              zIndex: 50,
            }}
          >
            💖
          </div>
        ))}

        {/* Main Content Card */}
        <div className="relative z-10 max-w-2xl mx-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center transform transition-all duration-500 hover:scale-105 border border-pink-200">
            {/* Cute icons */}
            <div className="text-6xl mb-6 animate-bounce">🌹 💕 🌸</div>

            {/* Main message */}
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-6">
              Thank You Baby
            </h1>

            <p className="text-3xl md:text-4xl text-gray-800 font-semibold leading-relaxed mb-8">
              I Love You So Much ❤️
            </p>

            {/* Flower button for extra love */}
            <button
              onClick={handleSurprise}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <span className="text-2xl group-hover:animate-spin">🌸</span>
              <span className="text-lg font-medium">For you, babyy</span>
              <span className="text-2xl group-hover:animate-bounce">💗</span>
            </button>

            {/* Surprise message */}
            {showSurprise && (
              <div className="mt-8 animate-slideUp">
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border-2 border-pink-300">
                  <div className="text-5xl mb-3 animate-pulse">💖💖💖</div>
                  <p className="text-xl text-pink-700 font-medium">
                  mwahhh ✨
                  </p>
                </div>
              </div>
            )}

            {/* Small footer */}
            <div className="mt-8 text-pink-400 text-sm">I love uuu</div>
          </div>
        </div>

        {/* Custom animations */}
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(1);
            opacity: 0;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-floatUp {
          animation: floatUp 2.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
      </div>
    </>
  );
}
