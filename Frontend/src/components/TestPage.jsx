import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background.jsx";
import { useNavigate } from "react-router-dom";

export function AuroraBackgroundDemo() {
  const navigate = useNavigate();
  const onsubmithandler = () => {
    navigate("/signup");
  };
  const onLoginHandler = () => {
    navigate("/login");
  }
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 60 }} // Start state
        animate={{ opacity: 2, y: 0 }} // End state
        transition={{
          delay: 0.5,
          duration: 1,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 z-10"
      >
        <div className="text-3xl md:text-7xl font-bold text-black dark:text-white text-center">
          Internship Task Could be fun you know
        </div>
        <div className="font-extralight text-base md:text-4xl text-gray-800 dark:text-neutral-200 py-4">
          And This is my submission
        </div>
        <div className="flex">
          <button
            onClick={onsubmithandler}
            className="bg-black mr-4 dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 hover:bg-indigo-500 hover:text-white transition duration-300 ease-in-out delay-10"
          >
            Signup
          </button>

          <button
            onClick={onLoginHandler}
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 hover:bg-indigo-500 hover:text-white transition duration-300 ease-in-out delay-10"
          >
            Login
          </button>
        </div>

      </motion.div>
    </AuroraBackground>
  );
}
