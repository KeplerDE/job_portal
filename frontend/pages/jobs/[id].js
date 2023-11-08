import Layout from "../../components/layout/Layout";
import axios from "axios";
import JobDetails from "@/components/job/JobDetails";


export default function JobDetailsPage( { job, candidates} ) {
    console.log(job)
    return (
        <Layout>
            <JobDetails job={job} candidates={candidates}  />
        </Layout>
    )
}


export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${params.id}`);
    const responseData = response.data;
    const job = responseData.job;
    const candidates = responseData.candidates;

    return {
      props: {
        job,
        candidates,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        job: null,
        candidates: null,
        error: "Error fetching data",
      },
    };
  }
}
