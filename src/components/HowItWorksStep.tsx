
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

const HowItWorksStep = ({
  number,
  title,
  description,
  icon,
  className,
}: HowItWorksStepProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="w-16 h-16 bg-idish-peach rounded-full flex items-center justify-center mb-4">
        <div className="text-idish-orange">{icon}</div>
      </div>
      <div className="mb-2 bg-idish-orange text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HowItWorksStep;
