import axios from "axios";
import { useState } from "react";

function AdminPage() {
  const [files, setFiles] = useState("");
  const uploadFile = (event) => {
    // const data = new FormData();
    // data.append("file", event.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const logs = JSON.parse(e.target.result);
      axios
        .post("http://localhost:5001/upload", { results: logs.runs[0].results })
        .then((res) => {
          console.log(res.statusText);
        });
    };
  };

  return (
    <>
      <h1>Upload</h1>
      <div className="">
        <input type="file" onChange={uploadFile} />
        {"uploaded file content -- " + files?.hello}
      </div>
    </>
  );
}

export default AdminPage;
