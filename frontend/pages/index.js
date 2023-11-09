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



export async function getServerSideProps({ query }) {
  // Retrieve keyword and location from the query parameters
  const keyword = query.keyword || "";
  const location = query.location || "";
  const page = query.page || "";

  // Construct the search query string
  // const queryStr = `keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
  const queryStr = `keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}${encodeURIComponent(page)}`;

  // Hardcoded server URL
  const serverUrl = 'http://127.0.0.1:8000/api/jobs/';

  // Make the request to the server with the search query string
  try {
    const response = await axios.get(`${serverUrl}?${queryStr}`);
    const data = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    // Log the error to the console
    console.error('Error fetching data:', error);

    // Return an error prop along with empty data
    return {
      props: {
        data: [],
        error: 'Failed to fetch data',
      },
    };
  }
}
