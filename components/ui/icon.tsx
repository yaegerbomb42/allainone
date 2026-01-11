import { icons } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
    name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = icons[name as keyof typeof icons];

    if (!LucideIcon) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <LucideIcon {...props} />;
};

export default Icon;
