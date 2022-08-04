import { useEffect, useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import styles from "./StepAvatar.module.css";
import { activate } from "../../../api";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepAvatar = ({ onNext }) => {
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("./image/monkey-avatar.png");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [unMounted, setUnMounted] = useState(false);

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        //clean the unwanted calls to avoid warnings
        if (!unMounted) dispatch(setAuth(data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      //in both the case we have to stop the loader so do it in finally block
      setLoading(false);
    }
  }
  //to clean the console
  useEffect(() => {
    return () => {
      setUnMounted(true);
    };
  }, []);

  if (loading) return <Loader message="Activation in progress..." />;

  return (
    <>
      <Card title={`Okey, ${name}!`}>
        <div className="flex flex-col items-center">
          <p className={styles.subHeading}>How's this Photo?</p>
          <div className={styles.avatarWrapper}>
            <img className={styles.avatarImage} src={image} alt="avatar" />
          </div>
          <div>
            <input
              onChange={captureImage}
              id="avatarInput"
              type="file"
              className={styles.avatarInput}
            />
            <label htmlFor="avatarInput" className={styles.avatarLabel}>
              Choose a different photo
            </label>
          </div>
          <Button text="Next" onClick={submit} />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
