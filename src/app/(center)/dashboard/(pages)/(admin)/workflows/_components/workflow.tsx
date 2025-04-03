import { 
  Card,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch"
import React from 'react'
import { Label } from '@/components/ui/label';

type Props = {
  id:string;
  name:string;
  description:string;
  publish:boolean | ""
}

const Workflow = ({ id,name,description,publish }: Props) => {
  return (
    // lg:w-2/5 md:w-full 
    <Card className='flex w-full items-center justify-between'>
      <CardHeader className='flex flex-col gap-4'>
        <Link
          href={`/workflows/editor/${id}`}
        >
          <div className='flex flex-row gap-2'>
            <Image
              src="/googleDrive.png"
              alt='googleDrive'
              width={300}
              height={300}
              className='object-contain'
            />
            <Image
              src="/notion.png"
              alt='googleDrive'
              width={300}
              height={300}
              className='object-contain'
            />
            <Image
              src="/discord.png"
              alt='googleDrive'
              width={300}
              height={300}
              className='object-contain'
            />
          </div>
          <div className='py-4'>
            <CardTitle className='text-lg'>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <div className='flex flex-col items-center gap-2 p-4'>
        <Label
          htmlFor='publish-toggle'
          className='text-muted-foreground'
        >
          On
        </Label>
        <Switch 
          id='publish-toggle'
          // onClick={onPublishFlow}
          // defaultChecked={props.publish!}
        />
      </div>
    </Card>
  )
}
export default Workflow;
