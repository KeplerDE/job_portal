import Layout from "../../components/layout/Layout";
import axios from "axios";


export default function JobDetailsPage( {job} ) {
    console.log(job)
    return (
        <Layout>
            <h1>
                Job Details
            </h1>
        </Layout>
    )
}


export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${params.id}`);
    const job = response.data;

    return {
      props: {
        job,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        job: null,
      },
    };
  }
}