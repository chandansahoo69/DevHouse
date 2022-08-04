import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllFollowing } from "../../api";
import Loader from "../../components/shared/Loader/Loader";
import PeopleFollowCard from "../../components/shared/PeopleFollowCard/PeopleFollowCard";

const Following = () => {
  const { id: userId } = useParams();
  const [allPeoples, setAllPeoples] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllFollowing = async () => {
      setLoading(true);
      const { data } = await getAllFollowing(userId);
      setAllPeoples(data.following);
      setLoading(false);
    };
    fetchAllFollowing();
  }, []);

  return (
    <>
      <div className="containerBox bg-blue-300 bg-opacity-5 rounded-lg p-6 mb-10">
        <div className="w-full flex-none text-lg text-gray-300 font-bold uppercase leading-none pt-2 pb-10">
          People to follow
        </div>
        {loading ? (
          <Loader message="Loading Peoples" />
        ) : (
          <>
            {allPeoples.length === 0 ? (
              <span className="text-sky_blue text-opacity-40 font-medium text-lg capitalize pt-4">
                You are not following to anyone.
              </span>
            ) : (
              <>
                {allPeoples.map((people) => (
                  <PeopleFollowCard people={people} key={people.id} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Following;
