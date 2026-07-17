import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [isLessLg, setisLessLg] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024)
        setisLessLg(true);
      else
        setisLessLg(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (isLessLg);
}