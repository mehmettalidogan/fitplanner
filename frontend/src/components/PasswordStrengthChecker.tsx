import React from 'react';

interface PasswordStrengthCheckerProps {
  password: string;
  className?: string;
}

interface PasswordCriteria {
  id: string;
  label: string;
  check: (password: string) => boolean;
  weight: number;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ 
  password, 
  className = '' 
}) => {
  const criteria: PasswordCriteria[] = [
    {
      id: 'length',
      label: 'En az 8 karakter',
      check: (pwd) => pwd.length >= 8,
      weight: 2
    },
    {
      id: 'lowercase',
      label: 'Küçük harf (a-z)',
      check: (pwd) => /[a-z]/.test(pwd),
      weight: 1
    },
    {
      id: 'uppercase',
      label: 'Büyük harf (A-Z)',
      check: (pwd) => /[A-Z]/.test(pwd),
      weight: 1
    },
    {
      id: 'number',
      label: 'Rakam (0-9)',
      check: (pwd) => /\d/.test(pwd),
      weight: 1
    },
    {
      id: 'special',
      label: 'Özel karakter (!@#$%...)',
      check: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      weight: 2
    },
    {
      id: 'noSequence',
      label: 'Ardışık karakterler yok (123, abc)',
      check: (pwd) => {
        const sequences = ['123', '234', '345', '456', '567', '678', '789', '890',
                          'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
                          'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr',
                          'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
        return !sequences.some(seq => pwd.toLowerCase().includes(seq));
      },
      weight: 1
    }
  ];

  const calculateStrength = () => {
    if (!password) return { score: 0, percentage: 0, level: 'none' };

    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    const achievedWeight = criteria.reduce((sum, criterion) => {
      return sum + (criterion.check(password) ? criterion.weight : 0);
    }, 0);

    const percentage = Math.round((achievedWeight / totalWeight) * 100);
    let level = 'weak';
    
    if (percentage >= 90) level = 'excellent';
    else if (percentage >= 75) level = 'strong';
    else if (percentage >= 50) level = 'medium';
    else if (percentage >= 25) level = 'weak';
    else level = 'very-weak';

    return { score: achievedWeight, percentage, level };
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-500 text-green-900';
      case 'strong':
        return 'bg-blue-500 text-blue-900';
      case 'medium':
        return 'bg-yellow-500 text-yellow-900';
      case 'weak':
        return 'bg-orange-500 text-orange-900';
      case 'very-weak':
        return 'bg-red-500 text-red-900';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const getStrengthLabel = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'Mükemmel';
      case 'strong':
        return 'Güçlü';
      case 'medium':
        return 'Orta';
      case 'weak':
        return 'Zayıf';
      case 'very-weak':
        return 'Çok Zayıf';
      default:
        return '';
    }
  };

  const strength = calculateStrength();

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Şifre Gücü
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStrengthColor(strength.level)}`}>
            {getStrengthLabel(strength.level)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength.level === 'excellent' ? 'bg-green-500' :
              strength.level === 'strong' ? 'bg-blue-500' :
              strength.level === 'medium' ? 'bg-yellow-500' :
              strength.level === 'weak' ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {strength.percentage}% güçlü
        </div>
      </div>

      {/* Criteria List */}
      <div className="grid grid-cols-1 gap-2">
        {criteria.map((criterion) => {
          const isValid = criterion.check(password);
          return (
            <div
              key={criterion.id}
              className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                isValid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                isValid
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {isValid ? '✓' : '○'}
              </div>
              <span className={isValid ? 'line-through' : ''}>{criterion.label}</span>
            </div>
          );
        })}
      </div>

      {/* Security Tips */}
      {strength.level === 'weak' || strength.level === 'very-weak' ? (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-yellow-800 dark:text-yellow-300 font-medium text-sm">
                Güvenlik Önerisi
              </p>
              <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-1">
                Daha güçlü bir şifre için yukarıdaki kriterleri karşılamaya çalışın. 
                Kişisel bilgiler kullanmayın ve şifrelerinizi düzenli olarak değiştirin.
              </p>
            </div>
          </div>
        </div>
      ) : strength.level === 'excellent' ? (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 dark:text-green-300 text-sm font-medium">
              Harika! Şifreniz çok güçlü 🛡️
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PasswordStrengthChecker; 