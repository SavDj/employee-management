import { useEffect, useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({ src, name, size = 'md', className = '' }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

    useEffect(() => {
    setImgError(false);
  }, [src]);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : '?';

  if (src && !imgError) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200 shadow-sm ${className}`} 
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm ${className}`}>
      {initials}
    </div>
  );
};