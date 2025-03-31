import { CheckCircle, Error, Speed, Warning } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import styles from "./index.module.css";

const PerformanceInsights = ({ data }: { data: (string | number)[][] }) => {
  const getInsights = () => {
    const insights: Array<{
      type: "success" | "warning" | "error";
      message: string;
      icon: React.ReactNode;
    }> = [];

    data.forEach((metricData) => {
      const metric = metricData[0];
      // FCP Insights
      if (metric === "first_contentful_paint") {
        const p75 = Number(metricData[4]);
        if (p75 <= 1800) {
          insights.push({
            type: "success",
            message: "Your First Contentful Paint (FCP) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 3000) {
          insights.push({
            type: "warning",
            message:
              "Your First Contentful Paint (FCP) needs improvement. Consider optimizing your server response time and reducing render-blocking resources.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your First Contentful Paint (FCP) is poor. Focus on server optimization and reducing initial page load.",
            icon: <Error color="error" />,
          });
        }
      }

      // LCP Insights
      if (metric === "largest_contentful_paint") {
        const p75 = Number(metricData[4]);
        if (p75 <= 2500) {
          insights.push({
            type: "success",
            message: "Your Largest Contentful Paint (LCP) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 4000) {
          insights.push({
            type: "warning",
            message:
              "Your Largest Contentful Paint (LCP) needs improvement. Consider optimizing images and reducing layout shifts.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your Largest Contentful Paint (LCP) is poor. Focus on image optimization and reducing layout shifts.",
            icon: <Error color="error" />,
          });
        }
      }

      // CLS Insights
      if (metric === "cumulative_layout_shift") {
        const p75 = Number(metricData[4]);
        if (p75 <= 0.1) {
          insights.push({
            type: "success",
            message: "Your Cumulative Layout Shift (CLS) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 0.25) {
          insights.push({
            type: "warning",
            message:
              "Your Cumulative Layout Shift (CLS) needs improvement. Consider reserving space for dynamic content.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your Cumulative Layout Shift (CLS) is poor. Focus on stabilizing your layout and reserving space for dynamic content.",
            icon: <Error color="error" />,
          });
        }
      }

      // TTFB Insights
      if (metric === "experimental_time_to_first_byte") {
        const p75 = Number(metricData[4]);
        if (p75 <= 800) {
          insights.push({
            type: "success",
            message: "Your Time to First Byte (TTFB) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 1800) {
          insights.push({
            type: "warning",
            message:
              "Your Time to First Byte (TTFB) needs improvement. Consider optimizing your server response time.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your Time to First Byte (TTFB) is poor. Focus on server optimization and reducing server response time.",
            icon: <Error color="error" />,
          });
        }
      }

      // INP Insights
      if (metric === "interaction_to_next_paint") {
        const p75 = Number(metricData[4]);
        if (p75 <= 200) {
          insights.push({
            type: "success",
            message: "Your Interaction to Next Paint (INP) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 500) {
          insights.push({
            type: "warning",
            message:
              "Your Interaction to Next Paint (INP) needs improvement. Consider optimizing JavaScript execution.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your Interaction to Next Paint (INP) is poor. Focus on optimizing JavaScript execution and reducing main thread work.",
            icon: <Error color="error" />,
          });
        }
      }

      // RTT Insights
      if (metric === "round_trip_time") {
        const p75 = Number(metricData[4]);
        if (p75 <= 100) {
          insights.push({
            type: "success",
            message: "Your Round Trip Time (RTT) is excellent!",
            icon: <CheckCircle color="success" />,
          });
        } else if (p75 <= 300) {
          insights.push({
            type: "warning",
            message:
              "Your Round Trip Time (RTT) needs improvement. Consider optimizing network latency and server response time.",
            icon: <Warning color="warning" />,
          });
        } else {
          insights.push({
            type: "error",
            message:
              "Your Round Trip Time (RTT) is poor. Focus on reducing network latency, optimizing server location, and improving server response time.",
            icon: <Error color="error" />,
          });
        }
      }
    });

    return insights;
  };

  const insights = getInsights();

  return (
    <Paper className={styles.insightsContainer}>
      <Box className={styles.header}>
        <Speed className={styles.icon} />
        <Typography variant="h6" component="h2">
          Performance Insights
        </Typography>
      </Box>
      <List>
        {insights.map((insight, index) => (
          <ListItem key={index} className={styles.insightItem}>
            <ListItemIcon>{insight.icon}</ListItemIcon>
            <ListItemText
              primary={insight.message}
              className={`${styles.insightText} ${styles[insight.type]}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PerformanceInsights;
