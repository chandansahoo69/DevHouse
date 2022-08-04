import { useState } from 'react';
import StepName from "../Steps/StepName/StepName";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";

const steps = {
    1: StepName,
    2: StepAvatar
}

const Activate = () => {
    const [step, setstep] = useState(1);
    const Step = steps[step];
    const onNext = () => {
        setstep(step + 1);
    }
    return (
        <div className="cardWrapper">
            <Step onNext={onNext}></Step>
        </div>
    )
}

export default Activate
