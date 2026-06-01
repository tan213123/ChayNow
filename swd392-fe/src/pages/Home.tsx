import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  // popup bot
  const [showBotReveal, setShowBotReveal] = useState(false);

  // popup người thật
  const [showHumanReveal, setShowHumanReveal] = useState(false);

  // vị trí random button "Không"
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
  });

  // button chạy random
  const moveButton = () => {
    const maxX = window.innerWidth / 2 - 180;
    const minX = -window.innerWidth / 2 + 180;

    const maxY = window.innerHeight / 2 - 120;
    const minY = -window.innerHeight / 2 + 120;

    const randomX = Math.floor(Math.random() * (maxX - minX) + minX);

    const randomY = Math.floor(Math.random() * (maxY - minY) + minY);

    setButtonPosition({
      x: randomX,
      y: randomY,
    });
  };

  // reset page
  const resetPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-purple-500 via-pink-400 to-cyan-400 flex items-center justify-center p-6 relative">
      {/* Background glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl"
      />

      {/* Popup BOT */}
      <AnimatePresence>
        {showBotReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
              }}
              className="bg-white rounded-3xl p-10 max-w-lg w-full text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 to-blue-500" />

              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="text-8xl mb-4 relative z-10"
              >
                🏳️‍🌈
              </motion.div>

              <h1 className="text-4xl font-extrabold mb-4 relative z-10 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Welcome to cộng đồng
              </h1>

              <p className="text-gray-600 mb-6 text-lg relative z-10">
                Ôi bạn ơi! Bạn đừng có chối! 👀
              </p>

              <p className="text-2xl font-bold text-gray-800 mb-4 relative z-10">
                Bạn chính thức là BOT 🫵🤖
              </p>

              <div className="text-6xl mb-6 relative z-10">🏳️‍🌈✨🤖✨🏳️‍🌈</div>

              <Button
                onClick={resetPage}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 relative z-10"
              >
                😭 Tôi muốn làm người lại
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Human */}
      <AnimatePresence>
        {showHumanReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.6, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 140,
              }}
              className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="text-7xl mb-5">🥀</div>

              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                Bạn đã nói vậy rồi thì oke thôi.
              </h2>

              <Button
                onClick={resetPage}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Quay lại
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            animate={{
              rotate: [0, 8, -8, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-8xl mb-5"
          >
            🤖❓
          </motion.div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Xác minh bạn không phải robot
          </h1>
        </div>

        {/* Question */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold text-gray-800">
            Bạn có phải bot không?
          </p>
        </div>

        {/* Buttons */}
        <div className="relative flex justify-center items-center min-h-[220px]">
          {/* Button chạy */}
          <motion.div
            animate={{
              x: buttonPosition.x,
              y: buttonPosition.y,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            onMouseEnter={moveButton}
            className="absolute"
          >
            <Button
              onClick={() => setShowHumanReveal(true)}
              className="py-7 px-8 rounded-2xl text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl"
            >
              Tôi không phải là robot
            </Button>
          </motion.div>

          {/* Button bot */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-0"
          >
            <Button
              onClick={() => setShowBotReveal(true)}
              className="py-7 px-8 rounded-2xl text-lg font-bold bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-xl"
            >
              🤖 Tôi là bot
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
