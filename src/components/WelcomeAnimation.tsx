import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onAnimationComplete: () => void;
}

export function WelcomeAnimation({ onAnimationComplete }: WelcomeAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2500);
    const timer3 = setTimeout(() => setCurrentStep(3), 4000);
    const timer4 = setTimeout(() => onAnimationComplete(), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/20 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* NASA Logo Animation */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {currentStep >= 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.3)",
                    "0 0 40px hsl(var(--primary) / 0.6)",
                    "0 0 20px hsl(var(--primary) / 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl font-bold text-white">NASA</span>
              </motion.div>
            </motion.div>
          )}

          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                STELLAR TEAM
              </motion.h1>
            </motion.div>
          )}

          {currentStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8"
            >
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Welcome to the Dashboard
              </motion.p>
            </motion.div>
          )}

          {currentStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary) / 0.4)",
                    "0 0 0 10px hsl(var(--primary) / 0)",
                    "0 0 0 0 hsl(var(--primary) / 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-primary font-medium">Initializing Systems</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbit animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-full h-full">
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent rounded-full"
              style={{
                transform: "translate(-50%, -50%) translateY(-150px)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}