import { motion } from 'framer-motion';
import type { PartyLayoutProps } from '../../../types';
import { PartyMemberSlot } from '../PartyMemberSlot';

export function VerticalLayout({ members, isSpinning }: PartyLayoutProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {members.map((member, index) => (
        <motion.div
          key={index}
          className="w-full flex justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
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
