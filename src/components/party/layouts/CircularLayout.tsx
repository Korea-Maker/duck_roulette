import { motion } from 'framer-motion';
import type { PartyLayoutProps } from '../../../types';
import { PartyMemberSlot } from '../PartyMemberSlot';
import { PARTY_CONFIG } from '../../../config/constants';

export function CircularLayout({ members, isSpinning }: PartyLayoutProps) {
  const radius = PARTY_CONFIG.CIRCULAR_RADIUS;
  const memberCount = members.length;

  // 멤버 수에 따른 각도 계산 (균등 분배, TOP이 12시 방향)
  const getPosition = (index: number) => {
    const angleStep = 360 / memberCount;
    const angle = -90 + (index * angleStep); // -90도부터 시작 (12시 방향)
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  // 슬롯 크기 (compact 모드)
  const slotWidth = 80;
  const slotHeight = 120;
  const containerSize = radius * 2 + slotHeight + 40;

  return (
    <motion.div
      className="relative w-full flex items-center justify-center"
      style={{ height: containerSize }}
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
          width: containerSize,
          height: containerSize,
        }}
      >
        <g transform={`translate(${containerSize / 2}, ${containerSize / 2})`}>
          {members.map((_, index) => {
            const pos = getPosition(index);
            const nextIndex = (index + 1) % memberCount;
            const nextPos = getPosition(nextIndex);
            return (
              <motion.line
                key={`line-${index}`}
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
        const pos = getPosition(index);

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -slotWidth / 2,
              marginTop: -slotHeight / 2,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: pos.x,
              y: pos.y,
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
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
          <span className="text-xl">🎰</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
