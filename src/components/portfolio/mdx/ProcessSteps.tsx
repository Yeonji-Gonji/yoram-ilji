import { ReactNode } from 'react';

/**
 * 기존 4단계 템플릿의 "01~04 번호 스텝" 디자인을 보존한 재사용 컴포넌트.
 * 강제가 아니라 원하는 케이스만 MDX에서 호출한다.
 *
 * <ProcessSteps>
 *   <ProcessStep number="01" title="Problem">...자유 본문...</ProcessStep>
 *   <ProcessStep number="02" title="Solution">...</ProcessStep>
 * </ProcessSteps>
 */
export function ProcessSteps({ children }: { children: ReactNode }) {
  return <div className="my-12 space-y-14">{children}</div>;
}

interface StepProps {
  number: string; // "01"
  title: string;
  children: ReactNode;
}

export function ProcessStep({ number, title, children }: StepProps) {
  return (
    <div>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="text-5xl font-medium text-point/20">{number}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="ml-0 leading-relaxed text-dark-600 dark:text-dark-400 md:ml-16">
        {children}
      </div>
    </div>
  );
}
