import Layout from "../components/layout/Layout";
import Home from "../components/Home";

import axios from "axios";

export default function Index({ data }) {
  return (
    <Layout>
      <Home data={data} />
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const jobType = query.jobType || "";
  const education = query.education || "";
  const experience = query.experience || "";
  const keyword = query.keyword || "";
  const location = query.location || "";
  const page = query.page || 1;

  let min_salary = "";
  let max_salary = "";

  // Correctly parse the salary range from the query
  if (query.salary) {
    const salaryRange = query.salary.split("-");
    if (salaryRange.length === 2) {
      [min_salary, max_salary] = salaryRange;
    }
  }

  // Construct the query string using template literals and encodeURIComponent for parameter values
  const queryStr = `keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&page=${encodeURIComponent(page)}&jobType=${encodeURIComponent(jobType)}&education=${encodeURIComponent(education)}&experience=${encodeURIComponent(experience)}&min_salary=${encodeURIComponent(min_salary)}&max_salary=${encodeURIComponent(max_salary)}`;

  // Replace process.env.API_URL with the provided static URL
  const res = await axios.get(`${process.env.API_URL}/api/jobs?${queryStr}`);
  const data = res.data;

  return {
    props: {
      data,
    },
  };
}