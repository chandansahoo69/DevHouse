import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const [fullname, setFullname] = useState(name);
  const dispatch = useDispatch();

  function nextStep() {
    if (!fullname) {
      return;
    }
    //store the name in store
    dispatch(setName(fullname));
    onNext();
  }

  return (
    <>
      <Card title="What's your full name?" icon="name">
        <div className="flex flex-col items-center">
          <TextInput
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <p className="w-11/12 py-4 text-slate-300 text-lg">
            People use real names at devhouse :)
          </p>
          <Button text="Next" onClick={nextStep} />
        </div>
      </Card>
    </>
  );
};

export default StepName;
