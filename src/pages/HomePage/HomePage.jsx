import { useMemo, useRef, useState, createRef, useEffect } from "react";
import "./HomePage.css";
import TinderCard from "react-tinder-card";
import axios from "axios";

function HomePage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/issues").then((res) => {
      setIssues(res.data.issues);
      setCurrentIndex(res.data.issues.length - 1);
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(issues.length - 1);
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(issues.length)
        .fill(0)
        .map(() => createRef()),
    [issues]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction, issueID, index) => {
    updateCurrentIndex(index - 1);
    if (direction === "right") {
      await axios.post("http://localhost:5001/assign", {
        id: issueID,
        username: localStorage.getItem("username"),
      });
    } else if (direction === "up") {
      await axios.post("http://localhost:5001/issue", {
        id: issueID,
        username: localStorage.getItem("username"),
      });
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < issues.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <div className="home-container">
      <h2 className="title">Bug Pick Up</h2>
      <div className="cards-container">
        <div className="cards">
          <TinderCard preventSwipe={["left", "right", "up", "down"]}>
            <div className="card">
              <h3>No more issues left</h3>
            </div>
          </TinderCard>
          {issues.map((issue, index) => (
            <TinderCard
              ref={childRefs[index]}
              key={issue._id}
              onSwipe={(dir) => swiped(dir, issue._id, index)}
              onCardLeftScreen={() => outOfFrame(issue.ruleId, index)}
            >
              <div className="card">
                <h2>{"RULE: "}</h2>
                <h3>{issue.ruleId}</h3>
                <h3>{"AT:"}</h3>
                <div className="card-file-path">
                  {issue.location.artifactLocation.uri
                    .split("/")
                    .map((item, index, orignal) => (
                      <h4 key={index}>
                        {(index > 0 ? "|" : "") +
                          "_".repeat(index) +
                          item +
                          (index === orignal.length - 1
                            ? ":" +
                              issue.location.region.startLine +
                              ":" +
                              issue.location.region.startColumn
                            : "")}
                      </h4>
                    ))}
                </div>
                <h3>{"Details:"}</h3>
                <h5>{issue.message}</h5>
                <h3>
                  {"Possible Points: " + (1000 + 500 * issue.persistent + 250)}
                </h3>
                <h5>{"+1000 for finishing"}</h5>
                <h5>{"+" + 500 * issue.persistent + " persistent bonus"}</h5>
                <h5>{"+250 when fix validated by next scan"}</h5>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
      <div className="card-buttons-container">
        <button onClick={() => swipe("left")}>Nope</button>
        <button onClick={() => swipe("up")}>False Positive</button>
        <button onClick={() => swipe("right")}>Dope</button>
      </div>
    </div>
  );
}

export default HomePage;
