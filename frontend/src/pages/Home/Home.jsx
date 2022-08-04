import { useHistory } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const history = useHistory();

  function startRegister() {
    history.push("/authenticate");
  }

  return (
    <div className="flex items-center justify-center mt-20">
      <Card title="Welcome to Devshouse!" icon="wavehand">
        <p className="text-slate-300 text-base lg:text-lg md:text-lg">
          We’re working hard to get Devshouse ready for everyone! While we wrap
          up the finishing youches, we’re adding people gradually to make sure
          nothing breaks.
        </p>
        <Button onClick={startRegister} text="Let's Go" />
        <span className="text-blue-600">Have an invite text?</span>
      </Card>
    </div>
  );
};

export default Home;
