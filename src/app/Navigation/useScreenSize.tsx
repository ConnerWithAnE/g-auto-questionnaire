import { useCallback, useEffect, useState } from "react";

export const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: MediaQueryListEvent) => {
        setTargetReached(e.matches);
    }, []);

    useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        media.addEventListener("change", updateTarget);

        // Check on mount (the event listener is not triggered until a change occurs)
        if (media.matches) {
            setTargetReached(true);
        }

        return () => media.removeEventListener("change", updateTarget);
    }, [width, updateTarget]);

    return targetReached;
};
