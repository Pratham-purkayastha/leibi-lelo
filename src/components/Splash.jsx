export default function Splash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-300 text-white">
      {/* Top emojis instead of images */}
      <div className="flex items-center space-x-6 text-7xl mb-4">
        <span>🏏</span>  {/* cricket bat + ball emoji */}
        <span>🏏</span>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-8">CRICKMATE!</h1>

      {/* Buttons */}
      <div className="flex flex-col space-y-6 w-64">
        <button className="flex items-center justify-center bg-purple-700 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:bg-purple-600 transition">
          <span className="mr-3 text-2xl">🤖</span> VS AI
        </button>

        <button className="flex items-center justify-center bg-orange-600 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:bg-orange-500 transition">
          <span className="mr-3 text-2xl">🎮</span> MULTIPLAYER
        </button>
      </div>

      {/* Bottom stumps emoji */}
      <div className="mt-10 text-6xl">🪵</div>
    </div>
  );
}
      
