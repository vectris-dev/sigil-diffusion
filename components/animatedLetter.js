import { motion } from 'framer-motion'

export function AnimatedLetter({ letter, isRemoved, delay }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 1, y: 0 }}
      animate={isRemoved ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {letter}
    </motion.span>
  )
}

