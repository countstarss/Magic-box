import { FeaturesSection } from "@/components/HomePage/Section/FeatureSection";
import { Navbar } from "@/components/HomePage/Nav/Navbar";
import QuestionAndAnswer from "@/components/HomePage/Section/Q&A";
import { homePageQAndA } from "@/lib/data/Q&A-item";
import TitleSection from "@/components/HomePage/Section/TitleSection";
import { FeedbackSection } from "@/components/HomePage/Section/Feedback";
import { CTASection } from "@/components/HomePage/Section/CTA";
import { Fotter } from "@/components/HomePage/Section/fotter";

export const revalidate = 60; // 每 60 秒重新验证数据

export default function Home() {
  return (
    // NOTE: 负责首页样式和布局，同级别路由可完全替换 ，如 /studio/
    <>
      <Navbar className='' />
      {/* <Banner bannerUrl="/images/GhostForest.jpg" className='mt-[95px] '/> */}

      <TitleSection />

      <FeaturesSection />

      <FeedbackSection />

      <QuestionAndAnswer items={homePageQAndA} />

      <CTASection />

      <Fotter />
    </>
  );
}









