import axios from "axios";

function AdminPage() {
  const uploadFile = (event) => {
    const data = new FormData();
    data.append("file", event.target.files[0]);
    axios.post("http://localhost:5001/upload", data).then((res) => {
      console.log(res.statusText);
    });
  };

  return (
    <>
      <h1>Admin</h1>
      <div className="">
        <p>
          <input type="file" onChange={uploadFile} />
          Edit <code>src/pages/AdminPage/AdminPage.jsx</code> and save to see
          changes
        </p>
      </div>
    </>
  );
}

export default AdminPage;
