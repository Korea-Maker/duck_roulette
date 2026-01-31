import { motion } from 'framer-motion';
import type { PartyLayoutProps } from '../../../types';
import { PartyMemberSlot } from '../PartyMemberSlot';

export function HorizontalLayout({ members, isSpinning }: PartyLayoutProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {members.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PartyMemberSlot
            member={member}
            isSpinning={isSpinning}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
