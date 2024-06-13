import axios from "axios";
import { useEffect, useState } from "react";
import "./AssignmentPage.css";

function AssignmentPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:5001/assigned", {
        username: localStorage.getItem("username"),
      })
      .then((res) => {
        setIssues(res.data.issues);
      });
  }, []);
  let heading = ["Rule", "location", "Points", "Mark As Fixed"];

  return (
    <div className="assignment-container">
      <h2>Assigned Issues</h2>
      <div className="assignment-table">
        <table>
          <thead>
            <tr>
              {heading.map((head, headID) => (
                <th
                  key={headID}
                  style={{
                    textAlign: "left",
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.ruleId}</td>
                <td>
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
                </td>
                <td>
                  <h4>{"+"+1000}</h4>
                  <h4>{"+" + 500 * issue.persistent + " persistent bonus"}</h4>
                  <h4>{"+250 When validated by next scan"}</h4>
                </td>
                <td>
                  <button
                    onClick={async () => {
                      const res = await axios.post(
                        "http://localhost:5001/done",
                        {
                          id: issue._id,
                          username: localStorage.getItem("username"),
                        }
                      );
                      setIssues(res.data.issues);
                    }}
                  >
                    ✓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignmentPage;
