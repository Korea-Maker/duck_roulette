import { motion } from 'framer-motion';
import type { PartyLayoutProps, Lane } from '../../../types';
import { PartyMemberSlot } from '../PartyMemberSlot';
import { LANES } from '../../../data/lanes';
import { PARTY_CONFIG, CIRCULAR_ANGLES } from '../../../config/constants';

export function CircularLayout({ members, isSpinning }: PartyLayoutProps) {
  const radius = PARTY_CONFIG.CIRCULAR_RADIUS;

  const getPosition = (lane: Lane) => {
    const angle = CIRCULAR_ANGLES[lane];
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <motion.div
      className="relative w-full flex items-center justify-center"
      style={{ height: radius * 2 + 180 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 중앙 원형 배경 */}
      <motion.div
        className="absolute rounded-full border-2 border-gray-700/30"
        style={{
          width: radius * 2,
          height: radius * 2,
          background: 'radial-gradient(circle, rgba(30,30,40,0.5) 0%, transparent 70%)',
        }}
        animate={isSpinning ? {
          borderColor: [
            'rgba(100, 100, 120, 0.3)',
            'rgba(255, 215, 0, 0.5)',
            'rgba(100, 100, 120, 0.3)',
          ],
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.1)',
            '0 0 40px rgba(255, 215, 0, 0.3)',
            '0 0 20px rgba(255, 215, 0, 0.1)',
          ],
        } : {}}
        transition={{ duration: 1.5, repeat: isSpinning ? Infinity : 0 }}
      />

      {/* 연결선 */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: radius * 2 + 100,
          height: radius * 2 + 100,
        }}
      >
        <g transform={`translate(${radius + 50}, ${radius + 50})`}>
          {members.map((member, index) => {
            const pos = getPosition(member.lane);
            const nextMember = members[(index + 1) % members.length];
            const nextPos = getPosition(nextMember.lane);
            return (
              <motion.line
                key={`line-${member.lane}`}
                x1={pos.x}
                y1={pos.y}
                x2={nextPos.x}
                y2={nextPos.y}
                stroke="rgba(100, 100, 120, 0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            );
          })}
        </g>
      </svg>

      {/* 멤버 슬롯들 */}
      {members.map((member, index) => {
        const laneInfo = LANES.find(l => l.id === member.lane) || LANES[index];
        const pos = getPosition(member.lane);

        return (
          <motion.div
            key={member.lane}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: pos.x - 60,
              y: pos.y - 50,
            }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          >
            <PartyMemberSlot
              member={member}
              laneInfo={laneInfo}
              isSpinning={isSpinning}
              compact
            />
          </motion.div>
        );
      })}

      {/* 중앙 장식 */}
      <motion.div
        className="absolute flex items-center justify-center"
        animate={isSpinning ? {
          rotate: 360,
        } : {}}
        transition={{
          duration: 3,
          repeat: isSpinning ? Infinity : 0,
          ease: 'linear',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
          <span className="text-2xl">🎰</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
