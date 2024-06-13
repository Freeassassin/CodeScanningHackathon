import axios from "axios";
import { useState } from "react";
import "./AdminPage.css";

function AdminPage() {
  const [files, setFiles] = useState([]);
  const [color, setColor] = useState(null);
  const uploadFile = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const logs = JSON.parse(e.target.result);
      setFiles(logs.runs[0].results);
    };
  };

  return (
    <div className="admin-container">
      <h2>Upload</h2>
      <input type="file" onChange={uploadFile} />
      <h3
        style={{
          marginTop: "2vh",
        }}
      >
        Bugs Found:
      </h3>
      {files.length > 0
        ? files.map((result, index) => (
            <div className="issue" key={index}>
              <h3>{result.ruleId}</h3>

              {result.locations[0].physicalLocation.artifactLocation.uri
                .split("/")
                .map((item, index, orignal) => (
                  <h4 key={index}>
                    {(index > 0 ? "|" : "") +
                      "_".repeat(index) +
                      item +
                      (index === orignal.length - 1
                        ? ":" +
                          result.locations[0].physicalLocation.region
                            .startLine +
                          ":" +
                          result.locations[0].physicalLocation.region
                            .startColumn
                        : "")}
                  </h4>
                ))}
              <h4>{result.message.text}</h4>
            </div>
          ))
        : null}
      <button
        onClick={() => {
          axios
            .post("http://localhost:5001/upload", {
              results: files,
            })
            .then((response) => {
              console.log(response.status);
              if (response.status == 200) setColor("green");
            });
        }}
        style={{
          marginTop: "2vh",
          backgroundColor: color,
        }}
        disabled={color ? true : false}
      >
        {color ? "Uploaded Successfully" : "Upload"}
      </button>
    </div>
  );
}

export default AdminPage;
