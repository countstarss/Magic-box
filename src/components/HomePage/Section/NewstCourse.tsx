import prisma from '@/lib/prisma'
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TeacherCard } from '../../TeacherCard';



async function getData() {
  try {
    const data = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        smallSummary: true,
        description: true,
        image: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

const NewstCourse = async () => {

  const data = await getData()

  if (!data) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  return (
    <section className=''>
      {/* 
      // MARK: TITLE
      */}
      <div className='md:flex md:items-center md:justify-between'>
        <h2 className='text-2xl font-bold tracking-tighter'>
          Newest Courses
        </h2>
        <div className='flex flex-row items-center'>
          <Link href="/course" className='text-md hidden font-bold text-primary hover:text-primary/75 md:block'>
            All Courses
          </Link>
          <ArrowRight className='hidden md:block' />
        </div>
      </div>

      {/* 
      // MARK: LIST
      */}
      <div className='grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 mt-4 gap-10'>
        {data?.map((course) => (
          <TeacherCard
            key={course.id}
            id={course.id}
            title={course.title}
            price={course.price}
            image={course.image}
            category="course"
          />
        ))}
      </div>
    </section>
  )
}

export default NewstCourse