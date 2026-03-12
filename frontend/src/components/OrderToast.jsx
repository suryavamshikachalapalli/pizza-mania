import React, { useState, useEffect, useRef } from 'react';

const TOTAL_SECONDS = 10 * 60; // 10 minutes
const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45

export default function OrderToast({ order, onClose, onViewOrder }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [phase, setPhase] = useState('entering'); // entering | visible | exiting
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start timer
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Animate in
    setTimeout(() => setPhase('visible'), 50);

    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / TOTAL_SECONDS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Color transitions based on time left
  const getColor = () => {
    if (progress > 0.6) return '#ea580c'; // orange
    if (progress > 0.3) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const handleClose = () => {
    setPhase('exiting');
    setTimeout(onClose, 300);
  };

  const statusMessages = [
    { threshold: 0.85, msg: 'Your order is confirmed! 🎉', sub: 'We\'re prepping your pizza right now' },
    { threshold: 0.6, msg: 'Dough is being stretched! 🤌', sub: 'Master pizzaiolo at work' },
    { threshold: 0.35, msg: 'Into the wood-fired oven! 🔥', sub: 'Heating up at 900°F' },
    { threshold: 0.1, msg: 'Almost there! 🏃', sub: 'Your pizza is on its way' },
    { threshold: 0, msg: 'Your pizza is here! 🎊', sub: 'Enjoy your meal!' },
  ];

  const currentStatus = statusMessages.find(s => progress >= s.threshold) || statusMessages[statusMessages.length - 1];

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      phase === 'entering' ? 'translate-x-full opacity-0' :
      phase === 'exiting' ? 'translate-x-full opacity-0' :
      'translate-x-0 opacity-100'
    }`}>
      <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden w-80 sm:w-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍕</span>
            <div>
              <p className="text-white font-bold text-sm">Order #{order.orderId}</p>
              <p className="text-orange-100 text-xs">Placed successfully!</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timer & Status */}
        <div className="p-5 flex items-center gap-5">
          {/* Circular Timer */}
          <div className="relative flex-shrink-0">
            <svg width="110" height="110" viewBox="0 0 110 110">
              {/* Background ring */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="8"
              />
              {/* Progress ring */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke={getColor()}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease'
                }}
              />
              {/* Center content */}
              <text x="55" y="48" textAnchor="middle" className="font-mono" style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '22px',
                fontWeight: '700',
                fill: getColor()
              }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </text>
              <text x="55" y="67" textAnchor="middle" style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '9px',
                fill: '#78716c',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                MINUTES
              </text>
            </svg>
            {/* Pulse rings */}
            {secondsLeft > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-full border-2 border-orange-300 animate-ping opacity-30" />
              </div>
            )}
          </div>

          {/* Status Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-800 text-sm leading-tight">{currentStatus.msg}</p>
            <p className="text-stone-500 text-xs mt-1">{currentStatus.sub}</p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>Progress</span>
                <span>{Math.round((1 - progress) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(1 - progress) * 100}%`,
                    background: `linear-gradient(90deg, ${getColor()}, #f97316)`
                  }}
                />
              </div>
            </div>

            {/* Order summary */}
            <p className="text-xs text-stone-400 mt-2 truncate">
              Total: ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* Status steps */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between">
            {['Confirmed', 'Preparing', 'Baking', 'Ready'].map((step, i) => {
              const stepProgress = 1 - progress;
              const isActive = stepProgress >= (i / 3);
              const isCurrent = Math.floor(stepProgress * 4) === i;
              return (
                <div key={step} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
                    isActive ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-300'
                  } ${isCurrent ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}>
                    {isActive ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-orange-600 font-medium' : 'text-stone-400'}`}>
                    {step}
                  </span>
                  {i < 3 && (
                    <div className="absolute" style={{ display: 'none' }} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Connecting lines */}
          <div className="relative -mt-8 mb-4 flex items-center px-3">
            <div className="flex-1 h-0.5 bg-orange-100 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-orange-400 transition-all duration-1000"
                style={{ width: `${Math.min(100, (1 - progress) * 133)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={() => { onViewOrder(); handleClose(); }}
            className="flex-1 btn-primary text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            Track Order
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 border border-orange-200 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
