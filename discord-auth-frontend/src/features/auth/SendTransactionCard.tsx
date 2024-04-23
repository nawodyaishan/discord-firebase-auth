import { Card, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';

export default function SendTransaction() {
  return (
    <Card className={'flex flex-col justify-center items-center p-5 space-y-2'}>
      <CardHeader className={'flex-col items-center'}>
        <CardTitle>Send Transaction</CardTitle>
      </CardHeader>
      <form className={'flex-col items-center'}>
        <Card className="flex justify-center w-full max-w-sm space-x-4 p-5">
          <Input name="address" placeholder="0xA0Cf…251e" required />
          <Input name="value" placeholder="0.05" required />
        </Card>
        <div className="flex justify-center w-full max-w-sm space-x-4 p-5">
          <Button className={'space-y-1'} variant={'destructive'} type="submit">
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
