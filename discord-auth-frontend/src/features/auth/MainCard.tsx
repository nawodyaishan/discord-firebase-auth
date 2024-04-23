import { ReactNode } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';

interface MainCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

function MainCard(props: MainCardProps) {
  const { title, description, children } = props;
  return (
    <Card className="flex flex-col justify-center items-center p-10">
      <CardHeader className="flex flex-col items-center gap-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}

export default MainCard;
