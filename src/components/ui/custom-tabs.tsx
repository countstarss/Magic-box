'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const CustomTabs = TabsPrimitive.Root;

const CustomTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  return (
    <MotionConfig transition={{ duration: 0.4, type: 'spring', bounce: 0.15 }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground relative',
          className,
        )}
        {...props}
      />
    </MotionConfig>
  );
});
CustomTabsList.displayName = 'CustomTabsList';

interface CustomTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  gradient?: boolean;
}

const CustomTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  CustomTabsTriggerProps
>(({ className, children, ...props }, ref) => {
  // 使用useRef来获取DOM元素
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  // 使用effect监听resize事件和data-state变化
  React.useEffect(() => {
    if (!triggerRef.current) return;

    const updateDimensions = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const parentRect =
          triggerRef.current.parentElement?.getBoundingClientRect() || {
            x: 0,
            y: 0,
          };

        // 计算相对于父元素的位置
        if (isActive || dimensions) {
          setDimensions({
            width: rect.width,
            height: rect.height,
            x: rect.x - parentRect.x,
            y: rect.y - parentRect.y,
          });
        }
      }
    };

    // MutationObserver监视data-state属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-state'
        ) {
          const newState = triggerRef.current?.getAttribute('data-state');
          setIsActive(newState === 'active');
          updateDimensions();
        }
      });
    });

    // 开始观察属性变化
    observer.observe(triggerRef.current, { attributes: true });

    // 初始检查
    const currentState = triggerRef.current.getAttribute('data-state');
    setIsActive(currentState === 'active');
    updateDimensions();

    // 监听窗口大小变化
    window.addEventListener('resize', updateDimensions);

    // 清理
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // 合并ref
  const combinedRef = React.useMemo(() => {
    return (node: HTMLButtonElement) => {
      triggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
  }, [ref]);

  return (
    <TabsPrimitive.Trigger
      ref={combinedRef}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-10 overflow-hidden',
        className,
      )}
      {...props}
    >
      <span className='relative z-20'>{children}</span>
    </TabsPrimitive.Trigger>
  );
});
CustomTabsTrigger.displayName = 'CustomTabsTrigger';

const CustomTabsIndicator = () => {
  const [activeTab, setActiveTab] = React.useState<HTMLElement | null>(null);
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const updateIndicator = () => {
      const activeElement = document.querySelector(
        '[data-state="active"][role="tab"]',
      ) as HTMLElement;
      if (activeElement) {
        setActiveTab(activeElement);

        // 获取TabsList元素以计算正确的相对位置
        const tabsList = activeElement.closest('[role="tablist"]');
        if (!tabsList) return;

        const rect = activeElement.getBoundingClientRect();
        const parentRect = tabsList.getBoundingClientRect();

        // 精确计算相对于TabsList的位置
        setDimensions({
          width: rect.width,
          height: rect.height,
          x: rect.left - parentRect.left,
          y: rect.top - parentRect.top,
        });
      }
    };

    updateIndicator();

    // MutationObserver监视data-state属性变化
    const observer = new MutationObserver(updateIndicator);

    // 监视整个TabsList内的变化
    const tabsListElement = document.querySelector('[role="tablist"]');
    if (tabsListElement) {
      observer.observe(tabsListElement, {
        attributes: true,
        attributeFilter: ['data-state'],
        subtree: true,
      });
    }

    // 监听窗口大小变化
    window.addEventListener('resize', updateIndicator);

    // 清理
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  if (!activeTab) return null;

  return (
    <motion.div
      className='absolute top-0 left-0 rounded-md bg-background shadow pointer-events-none z-[1]'
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: dimensions.x,
        y: dimensions.y,
        width: dimensions.width,
        height: dimensions.height,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    />
  );
};

interface CustomTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  slideDirection?: 'left' | 'right' | 'up' | 'down';
}

const CustomTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  CustomTabsContentProps
>(({ className, children, slideDirection = 'right', ...props }, ref) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: slideDirection === 'right' ? 20 : slideDirection === 'left' ? -20 : 0,
      y: slideDirection === 'down' ? 20 : slideDirection === 'up' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: slideDirection === 'right' ? -20 : slideDirection === 'left' ? 20 : 0,
      y: slideDirection === 'down' ? -20 : slideDirection === 'up' ? 20 : 0,
    },
  };

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      <AnimatePresence
        mode='wait'
        initial={false}
      >
        <motion.div
          key={props.value as string}
          variants={variants}
          initial='hidden'
          animate='visible'
          exit='exit'
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
          className='w-full'
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
});
CustomTabsContent.displayName = 'CustomTabsContent';

export {
  CustomTabs,
  CustomTabsList,
  CustomTabsTrigger,
  CustomTabsContent,
  CustomTabsIndicator,
};