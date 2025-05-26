import { motion } from "framer-motion";

const DIRECTIONS = [
  {
    // 1: ↘️
    from: { x: -800, y: -400 },
    c1: { x: -400, y: -300 },
    c2: { x: 200, y: 200 },
    to: { x: 800, y: 600 },
  },
  {
    // 2: ↙️
    from: { x: 800, y: -400 },
    c1: { x: 400, y: -300 },
    c2: { x: -200, y: 200 },
    to: { x: -800, y: 600 },
  },
  {
    // 3: ↗️
    from: { x: -800, y: 600 },
    c1: { x: -400, y: 400 },
    c2: { x: 200, y: -200 },
    to: { x: 800, y: -400 },
  },
  {
    // 4: ↖️
    from: { x: 800, y: 600 },
    c1: { x: 400, y: 400 },
    c2: { x: -200, y: -200 },
    to: { x: -800, y: -400 },
  },
];

export function FloatingPaths() {
  const direction = DIRECTIONS[Math.floor(Math.random() * 4)];

  const paths = Array.from({ length: 36 }, (_, i) => {
    const dx = i * 20;
    const dy = i * 20;
    return {
      id: i,
      d: `M${direction.from.x - dx} ${direction.from.y + dy}
          C${direction.c1.x - dx} ${direction.c1.y + dy},
           ${direction.c2.x - dx} ${direction.c2.y + dy},
           ${direction.to.x - dx} ${direction.to.y + dy}`,
      width: 0.2 + i * 0.03,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
