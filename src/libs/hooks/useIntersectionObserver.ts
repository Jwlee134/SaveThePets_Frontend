import { useEffect, useRef } from "react";

export default function useIntersectionObserver(
  taskFn: Function,
  option?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) taskFn();
    }, option);
    observer.observe(ref.current);
    const refVal = ref.current;
    return () => {
      observer.unobserve(refVal);
    };
  }, [taskFn, option]);

  return ref;
}
