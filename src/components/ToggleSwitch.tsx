import { motion } from 'framer-motion';
import type { ToggleSwitchProps } from '../types';

export function ToggleSwitch({ enabled, onToggle, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-xs text-gray-300 font-medium">{label}</span>
      )}
      <button
        onClick={onToggle}
        className="relative"
        aria-pressed={enabled}
        aria-label={label ? `${label} toggle` : 'Toggle switch'}
      >
        {/* 배경 트랙 */}
        <motion.div
          className="w-14 h-7 rounded-full relative overflow-hidden"
          style={{
            background: enabled
              ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)'
              : 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
            boxShadow: enabled
              ? '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2), inset 0 2px 4px rgba(255,255,255,0.1)'
              : 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255,255,255,0.05)',
            border: enabled
              ? '2px solid rgba(0, 255, 136, 0.6)'
              : '2px solid rgba(100, 100, 120, 0.3)',
          }}
          animate={{
            boxShadow: enabled
              ? [
                  '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
                  '0 0 30px rgba(0, 255, 136, 0.7), 0 0 60px rgba(0, 255, 136, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)',
                  '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
                ]
              : 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255,255,255,0.05)',
          }}
          transition={enabled ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
          {/* 그리드 패턴 (게이밍 느낌) */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: enabled
                ? 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, 0.3) 25%, rgba(0, 255, 136, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.3) 75%, rgba(0, 255, 136, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, 0.3) 25%, rgba(0, 255, 136, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, 0.3) 75%, rgba(0, 255, 136, 0.3) 76%, transparent 77%, transparent)'
                : 'none',
              backgroundSize: '8px 8px',
            }}
          />
        </motion.div>

        {/* 노브 (손잡이) */}
        <motion.div
          className="absolute top-0.5 w-6 h-6 rounded-full"
          style={{
            background: enabled
              ? 'linear-gradient(135deg, #ffffff 0%, #b0ffdb 50%, #00ff88 100%)'
              : 'linear-gradient(135deg, #4a4a5e 0%, #3a3a4e 50%, #2a2a3e 100%)',
            boxShadow: enabled
              ? '0 0 15px rgba(0, 255, 136, 0.8), 0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255,255,255,0.1)',
          }}
          animate={{
            x: enabled ? 30 : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* 노브 내부 표시등 */}
          <motion.div
            className="absolute inset-1 rounded-full"
            style={{
              background: enabled
                ? 'radial-gradient(circle, rgba(0,255,136,0.8) 0%, rgba(0,255,136,0) 70%)'
                : 'radial-gradient(circle, rgba(100,100,120,0.3) 0%, rgba(100,100,120,0) 70%)',
            }}
            animate={enabled ? {
              opacity: [0.6, 1, 0.6],
            } : {}}
            transition={enabled ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
          />
        </motion.div>
      </button>

      {/* ON/OFF 텍스트 */}
      <motion.span
        className="text-xs font-bold uppercase tracking-wider min-w-[28px]"
        style={{
          color: enabled ? '#00ff88' : '#666680',
          textShadow: enabled ? '0 0 10px rgba(0, 255, 136, 0.8)' : 'none',
        }}
        animate={enabled ? {
          textShadow: [
            '0 0 10px rgba(0, 255, 136, 0.8)',
            '0 0 20px rgba(0, 255, 136, 1)',
            '0 0 10px rgba(0, 255, 136, 0.8)',
          ],
        } : {}}
        transition={enabled ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {enabled ? 'ON' : 'OFF'}
      </motion.span>
    </div>
  );
}
