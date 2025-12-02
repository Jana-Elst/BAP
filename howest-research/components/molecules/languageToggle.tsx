import { useState } from "react";
import Toggle from "../atoms/toggle";

const LanguageToggle = () => {
    const [isActive, setIsActive] = useState(true);

    return (
        <Toggle element1="NL" element2="EN" setIsActive={setIsActive} isActive={isActive} />
    )
}

export default LanguageToggle;