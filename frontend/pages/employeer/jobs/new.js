// Import statements remain the same
import axios from "axios";
import Layout from "@/components/layout/Layout";
import NewJob from "@/components/job/NewJob";
import { isAuthenticatedUser } from "@/utils/isAuthenticated";

// The NewJobPage component which will receive the jobs props
export default function NewJobPage({ jobs }) {
  return (
    <Layout title="Post a new Job">
      <NewJob jobs={jobs} />
    </Layout>
  );
}

// getServerSideProps will fetch the data when the page is requested
export async function getServerSideProps(context) {
  // You would get the access token from the context.req object
  const access_token = context.req.cookies.access;

  // Assuming isAuthenticatedUser is a function that returns a user object or null
  const user = await isAuthenticatedUser(access_token);

  // If there is no user, redirect to login
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If there is a user, fetch the jobs data
  const res = await axios.get(`${process.env.API_URL}/api/me/jobs/applied/`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const jobs = res.data;

  // Return the jobs data as props
  return {
    props: {
      jobs,
    },
  };
}
