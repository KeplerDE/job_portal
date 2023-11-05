import Layout from "../components/layout/Layout";
import Home from "../components/Home";
import axios from "axios";

export default function Index({ data }) {
  console.log("jobs", data);
  return (
    <Layout>
      <Home data={data} />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/jobs/");
    const data = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}
