// ClickableButton.js
// eslint-disable-next-line prettier/prettier
import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button'; // Assuming Button component is properly imported

export interface ClickableButtonProps {
  text: string;
  Icon: LucideIcon | ((props: { className: string }) => JSX.Element);
  onClick: () => void;
}

export const ClickableButton = ({
  text,
  Icon,
  onClick,
}: ClickableButtonProps) => (
  <Button
    variant="secondary"
    className="w-full cursor-pointer gap-3 transition-all duration-200 hover:shadow"
    onClick={onClick}
  >
    <Icon className="h-[18px] w-[18px]" />
    <span>{text}</span>
  </Button>
);
