import { useRef } from 'react';

function OtpInput({ value, onChange, disabled = false }) {
  const refs = useRef([]);

  const digits = Array.from({ length: 6 }, (_, index) => value[index] || '');

  function updateDigit(index, nextValue) {
    const sanitized = nextValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    onChange(nextDigits.join(''));

    if (sanitized && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) {
      return;
    }

    onChange(pasted);
    refs.current[Math.min(pasted.length, 6) - 1]?.focus();
  }

  return (
    <div className="flex flex-wrap gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-14 w-12 rounded-2xl border border-slate-200 bg-white text-center text-2xl font-bold tracking-wide text-slate-900 shadow-sm outline-none transition focus:border-tide focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default OtpInput;
