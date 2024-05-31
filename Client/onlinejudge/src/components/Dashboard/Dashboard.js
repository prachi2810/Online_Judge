import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import "./Dashboard.css";
import axiosUserPrivate from '../../api/axios';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

const Dashboard = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [submissionCountByLanguage, setSubmissionCountByLanguage] = useState({});
  const [submissionTrends, setSubmissionTrends] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});
  const axiosPrivate = useAxiosPrivate(axiosUserPrivate);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/getallsubmissiondetils"); // Replace with your actual endpoint
        const data = response.data;
        setSubmissionData(data);

        const countByLanguage = data.reduce((acc, submission) => {
          acc[submission.Language] = (acc[submission.Language] || 0) + 1;
          return acc;
        }, {});
        setSubmissionCountByLanguage(countByLanguage);

        const trends = data.reduce((acc, submission) => {
          const date = new Date(submission.SubmittedAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setSubmissionTrends(trends);

        const statusCounts = data.reduce((acc, submission) => {
          acc[submission.Status] = (acc[submission.Status] || 0) + 1;
          return acc;
        }, {});
        setSubmissionStatus(statusCounts);
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="chart-container">
        <BarChart data={submissionCountByLanguage} />
      </div>
      <div className="chart-container">
        <LineChart data={submissionTrends} />
      </div>
      <div className="chart-container">
        <PieChart data={submissionStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
