import { updateAvailability } from '@/app/server-actions/onBoardingService/AvailableActions';
import { SubmitButton } from '@/components/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import prisma from '@/lib/prisma';
import { getSession } from '@/utils/getSession';
import { times } from '@/lib/data/times'
import React from 'react';


async function getAvailability(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      day: 'asc'
    }
  })
  return data
}

const AvailabilityPageProps = async () => {

  const session = await getSession();
  const availabilityData = await getAvailability(session.user?.id as string)
  console.log(availabilityData)



  return (
    // Card
    <Card
    // MARK: Availability
    >
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Manage your availability time for booking.</CardDescription>
      </CardHeader>
      <form noValidate
        action={updateAvailability}
      > 
        <CardContent className="flex flex-col gap-y-4">
          {
            availabilityData.map((item) => (
              <div
                className="grid grid-cols-1 md:grid-cols-3 items-center gap-4"
                key={item.id}
              >
                <input type="hidden" name={`id-${item.id}`} value={item.id} />
                <div className="flex items-center gap-x-6 flex-row justify-start">
                  <Switch
                    name={`isActive-${item.id}`}
                    defaultChecked={item.isActive}
                  />
                  <p>{item.day}</p>
                </div>

                {/* <div className="flex flex-col gap-2 md:flex-row"> */}

                  <Select
                    name={`fromTime-${item.id}`}
                    defaultValue={item.fromTime.toISOString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="From Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='grid grid-cols-3'>
                        {times.map((time) => (
                          <SelectItem key={time.id} value={time.time}>
                            {time.time}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    name={`tillTime-${item.id}`}
                    defaultValue={item.tillTime.toISOString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="To Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {times.map((time) => (
                          <SelectItem key={time.id} value={time.time}>
                            {time.time}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

              // </div>
            ))
          }
        </CardContent>
        <SubmitButton title='Save Changes' className='w-full md:w-[200px] mb-5 mx-4'/>
      </form>
    </Card>
  );
};

export default AvailabilityPageProps;