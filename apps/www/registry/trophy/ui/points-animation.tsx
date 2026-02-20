"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Variants
const pointsAnimationVariants = cva(
  "pointer-events-none select-none font-bold tabular-nums",
  {
    variants: {
      variant: {
        float: "animate-points-float",
        pop: "animate-points-pop",
        slide: "animate-points-slide",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-xl",
        xl: "text-2xl",
      },
    },
    defaultVariants: {
      variant: "float",
      size: "default",
    },
  },
);

// Props
interface PointsAnimationProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pointsAnimationVariants> {
  /** Points value to display */
  value: number;
  /** Prefix (e.g., "+") */
  prefix?: string;
  /** Suffix (e.g., " XP") */
  suffix?: string;
  /** Color of the text */
  color?: "default" | "green" | "gold" | "blue" | "purple";
  /** Animation duration in ms */
  duration?: number;
  /** Callback when animation ends */
  onAnimationEnd?: () => void;
  /** Show the animation */
  show?: boolean;
}

const colorClasses = {
  default: "text-foreground",
  green: "text-green-500",
  gold: "text-yellow-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
} as const;

const PointsAnimation = React.forwardRef<HTMLDivElement, PointsAnimationProps>(
  (
    {
      className,
      variant,
      size,
      value,
      prefix = "+",
      suffix = "",
      color = "green",
      duration = 1000,
      onAnimationEnd,
      show = true,
      style,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(show);

    React.useEffect(() => {
      if (show) {
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
          onAnimationEnd?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [show, duration, onAnimationEnd]);

    if (!visible) return null;

    const displayValue =
      value >= 0 ? `${prefix}${value}${suffix}` : `${value}${suffix}`;

    return (
      <div
        ref={ref}
        className={cn(
          pointsAnimationVariants({ variant, size }),
          colorClasses[color],
          className,
        )}
        style={{
          animationDuration: `${duration}ms`,
          ...style,
        }}
        {...props}
      >
        {displayValue}
      </div>
    );
  },
);
PointsAnimation.displayName = "PointsAnimation";

// Container for managing multiple animations
interface PointsAnimationItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color?: PointsAnimationProps["color"];
  variant?: PointsAnimationProps["variant"];
  size?: PointsAnimationProps["size"];
  x?: number;
  y?: number;
}

interface PointsAnimationContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of animation items */
  items: PointsAnimationItem[];
  /** Callback when an item animation ends */
  onItemComplete?: (id: string) => void;
  /** Default animation duration */
  duration?: number;
}

const PointsAnimationContainer = React.forwardRef<
  HTMLDivElement,
  PointsAnimationContainerProps
>(
  (
    { className, items, onItemComplete, duration = 1000, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("pointer-events-none fixed inset-0 z-50 overflow-hidden", className)}
        {...props}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: item.x ?? "50%",
              top: item.y ?? "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <PointsAnimation
              value={item.value}
              prefix={item.prefix}
              suffix={item.suffix}
              color={item.color}
              variant={item.variant}
              size={item.size}
              duration={duration}
              onAnimationEnd={() => onItemComplete?.(item.id)}
            />
          </div>
        ))}
      </div>
    );
  },
);
PointsAnimationContainer.displayName = "PointsAnimationContainer";

// Hook for managing animation queue
function usePointsAnimation(options?: { duration?: number; maxItems?: number }) {
  const { duration = 1000, maxItems = 10 } = options ?? {};
  const [items, setItems] = React.useState<PointsAnimationItem[]>([]);

  const trigger = React.useCallback(
    (
      value: number,
      opts?: Partial<Omit<PointsAnimationItem, "id" | "value">>,
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setItems((prev) => {
        const next = [...prev, { id, value, ...opts }];
        return next.slice(-maxItems);
      });
      return id;
    },
    [maxItems],
  );

  const remove = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    trigger,
    remove,
    clear,
    duration,
  };
}

export {
  PointsAnimation,
  PointsAnimationContainer,
  usePointsAnimation,
  pointsAnimationVariants,
};
export type {
  PointsAnimationProps,
  PointsAnimationItem,
  PointsAnimationContainerProps,
};
