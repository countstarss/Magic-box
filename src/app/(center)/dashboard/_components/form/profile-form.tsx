'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema } from '@/lib/schema/profile-schema';
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  Name: string,
  email: string,
  profileImage: string,
  onUpdate?: (name: string) => void,
}

const ProfileForm = ({ Name, email, profileImage, onUpdate }: Props) => {

  const [isLoading, setIsLoading] = useState(false);
  // TODO: 使用EditUserProfileSchema进行表单验证
  // NOTE: 使用zod表单验证
  const form = useForm<z.infer<typeof ProfileSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: Name,
      email: email,
      profileImage: profileImage,
    },
  })

  const handleUpdate = () => {
    setIsLoading(true);
    try {
      onUpdate && onUpdate(form.getValues('fullName'))
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-6 w-full'
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>User name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >

        </FormField>
      </form>
      <form
        className='flex flex-col gap-6 w-full'
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <Button
          type="submit"
          className='self-start hover:bg-[#2f006b] hover:text-white hover:border-[2px]'
          onClick={() => handleUpdate}
        >
          {
            isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-1/4 animate-spin' />
                <span>Saving</span>
              </>
            ) : (
              'Save User Setting'
            )
          }
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm;