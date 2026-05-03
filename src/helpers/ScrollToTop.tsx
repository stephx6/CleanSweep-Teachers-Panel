import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ScrollToTop(){
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0,0);
    } , [location.pathname]);

    return null;
}