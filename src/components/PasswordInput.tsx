import React, { useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  icon?: LucideIcon;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ icon: Icon, className, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />}
      <input type={visible ? 'text' : 'password'} className={className} {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
