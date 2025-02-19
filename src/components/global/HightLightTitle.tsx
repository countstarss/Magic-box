import { HeroHighlight, Highlight } from "../ui/hero-highlight"
import { motion } from "framer-motion"

interface HightLightTitleProps {
    title: string
}

export const HightLightTitle = ({ title }: HightLightTitleProps) => {
    return (
        <div className="max-w-5xl h-24 items-center mx-auto text-center m-2 overflow-hidden">
            <HeroHighlight
            //MARK: Highlight
            >
                <motion.h3
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: [20, -5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="text-2xl px-4 md:text-4xl lg:text-4xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
                >
                    <Highlight className="text-black dark:text-white">
                        {title}
                    </Highlight>
                </motion.h3>
            </HeroHighlight>
        </div>
    )
}