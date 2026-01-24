import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';
import logger from '@/lib/services/logger';

interface IconProps extends LucideProps {
    name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = icons[name as keyof typeof icons];

    if (!LucideIcon) {
        logger.warn(`Icon "${name}" not found`);
        return null;
    }

    return <LucideIcon {...props} />;
};

export default Icon;
