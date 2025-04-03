// import { cancelMeetingAction } from "@/app/actions";
import EmptyState from "@/app/components/empty-state";
import { SubmitButton } from "@/app/components/submit-button";
import { auth } from "@/lib/auth";
import { nylas } from "@/lib/nylas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { format, fromUnixTime } from "date-fns";
import { Icon, Video } from "lucide-react";

import React from "react";
import { getSession } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { cancelMeetingAction } from "@/actions/MeetingActions";

async function getData(email: string) {
  const userData = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }
  const events = await nylas.events.list({
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  console.log(events.data[1].conferencing);
  return events;
}

const MeetingsPage = async () => {
  const session = await getSession();
  const events = await getData(session?.user?.email as string);

  return (
    // TODO: 给 Metings 添加分类和排序功能
    <>
      {events.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.data.map((item) => (
              <form
                key={item.id}
              action={cancelMeetingAction}
              >
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {
                        // @ts-ignore
                        format(fromUnixTime(item.when.startTime), "EEE, dd MMM")
                      }
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {
                        // @ts-ignore
                        format(fromUnixTime(item.when.startTime), "hh:mm a")
                      } -{" "}
                      {
                        // @ts-ignore
                        format(fromUnixTime(item.when.endTime), "hh:mm a")
                      }
                    </p>
                    <div className="flex items-center mt-1">
                      <Video className="size-4 mr-2 text-primary" />{" "}
                      <a
                        className="text-xs text-primary underline underline-offset-4"
                        target="_blank"
                        href={
                          // @ts-ignore
                          item.conferencing?.details?.url
                        }
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {/* You and {item.participants[0].name} */}
                      name
                    </p>
                  </div>
                  <SubmitButton
                    title="Cancel Event"
                    className="w-fit flex ml-auto bg-destructive text-destructive-foreground 
                              hover:bg-destructive/90 
                              hover:text-white 
                              hover:scale-105 transition-all
                              "
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;

{
  /* <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                    </p>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center">
                      <Video className="size-4 mr-2 text-primary" />{" "}
                      <a target="_blank" href={item.conferencing.details.url}>
                        Join Meeting
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h2>{item.title}</h2>
                    <p>You and {item.participants[0].name}</p>
                  </div>
                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form> */
}
