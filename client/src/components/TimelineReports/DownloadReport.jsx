import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export async function generateSafetyReport(
  data,
  snapshotRef,
  trendsRef,
  distributionRef
) {
  const doc = new jsPDF();
  const margin = 14;
  let y = 22;

  const addInsightText = (text) => {
    const lines = doc.splitTextToSize(`• ${text}`, 180);
    doc.setFontSize(13);
    doc.text(lines, margin, y);
    y += lines.length * 6;
  };

  const addHeading = (heading) => {
    doc.setFontSize(18);
    doc.setFont('bold');

    // Set the heading color to #006684
    doc.setTextColor(0, 102, 132); // RGB values for #006684

    doc.text(heading, margin, y);
    y += 8; // Adjust spacing after the heading

    doc.setFont('normal'); // Reset font to normal for other text
    doc.setTextColor(0, 0, 0); // Reset text color back to black for other texts
  };

  // 1. Title
  const monthName = data.name || 'Safety Compliance Report'; // You can dynamically get the month name from the data
  doc.setFontSize(25);
  doc.text(`${monthName} Report`, margin, y);
  y += 13;

  // 2. Basic Info with Bullet Points
  addHeading('Statistic Overview');
  y += 3;
  doc.setFontSize(12);

  // Using bullet points for the basic info text
  const basicInfo = [
    `Safety Score: ${data.safetyScore}`,
    `Monthly Progress: ${data.progress}`,
    `Total Incidents: ${data.totalIncidents}`,
    `Critical Incidents: ${data.criticalIncidents}`,
  ];

  // Add each item as a bullet point
  basicInfo.forEach((infoText) => {
    const lines = doc.splitTextToSize(`• ${infoText}`, 180); // Adds bullet point to each line
    doc.text(lines, margin, y);
    y += lines.length * 7; // Adjust vertical spacing based on the number of lines
  });

  if (data.duration) {
    const durationText = `Duration: ${data.duration.hours}h ${data.duration.minutes}m ${data.duration.seconds}s`;
    const lines = doc.splitTextToSize(`• ${durationText}`, 180); // Bullet point for duration
    doc.text(lines, margin, y);
    y += lines.length * 7; // Adjust vertical spacing based on the number of lines
    y += 7; // Add extra space after the duration
  }

  // 3. Trends Table
  if (data.trends?.length) {
    addHeading('Overall Compliance Scores');
    // Insight for Trends Table
    const latest = data.trends.at(-1).score;
    const prev = data.trends.length > 1 ? data.trends.at(-2).score : null;
    if (prev !== null) {
      if (latest > prev)
        addInsightText('Recent scores show improvement over time.');
      else if (latest < prev)
        addInsightText(
          'Recent drop in safety score — further investigation needed.'
        );
      else addInsightText('Safety score remains stable — maintain efforts.');
    }

    const trendRows = data.trends.map((t) => [
      t.date || t.time || 'N/A',
      t.score,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Date/Time', 'Score']],
      body: trendRows,
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // 4. Score Distribution Table
  if (data.safetyScoreDistribution) {
    addHeading('Compliance Score Distribution');
    // Insight for Score Distribution
    const lowScores = Object.entries(data.safetyScoreDistribution)
      .filter(([_, score]) => score < 70)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3); // Top 3 lowest scores

    if (lowScores.length > 0) {
      const names = lowScores.map(([metric]) => metric).join(', ');
      addInsightText(
        `Lowest performing metrics: ${names}. Recommend focused intervention.`
      );
    } else {
      addInsightText('All compliance metrics are performing above threshold.');
    }

    const distribution = Object.entries(data.safetyScoreDistribution).map(
      ([metric, value]) => [metric, value]
    );

    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Score']],
      body: distribution,
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // 5. Top 3 & Areas to Improve
  if (data.top3) {
    addHeading('Top 3 Metric Improvements ');
    const improvements = data.top3.improvements || [];
    const declines = data.top3.declinedMetrics || [];

    // Insight for Top 3 Improvements
    if (improvements.length) {
      const topMetric = improvements[0].name;
      addInsightText(
        `Most improved compliance area: ${topMetric}. Maintain focus here.`
      );
    }

    autoTable(doc, {
      startY: y,
      head: [['Top 3 Improvements', 'Value']],
      body: improvements.map((i) => [i.name, `${i.value}%`]),
    });

    y = doc.lastAutoTable.finalY + 15;

    // Insight for Areas to Improve
    if (declines.length) {
      addHeading('Areas to Improve');
      const worstMetric = declines[0].name;
      addInsightText(
        `Declining trend detected in: ${worstMetric}. Suggest targeted training or audits.`
      );
    }

    autoTable(doc, {
      startY: y,
      head: [['Areas to Improve', 'Value']],
      body: declines.map((d) => [d.name, `${d.value}%`]),
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // 6. Helper to insert image from ref
  const addImageFromRef = async (ref, label) => {
    if (!ref?.current) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(ref.current, {
      useCORS: true,
      backgroundColor: '#fff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);

    // Increased max size
    const maxWidth = 160; // in mm (bigger)
    const maxHeight = 90; // in mm (bigger)

    // Maintain aspect ratio
    let { width, height } = imgProps;
    const ratio = width / height;

    let targetWidth = maxWidth;
    let targetHeight = maxWidth / ratio;

    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = maxHeight * ratio;
    }

    // Left align
    const x = margin;

    // Check if there's space left on page
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + targetHeight + 20 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    // Add label
    doc.setFontSize(14);
    doc.text(label, margin, y);
    y += 6;

    // Add image
    doc.addImage(imgData, 'PNG', x, y, targetWidth, targetHeight);
    y += targetHeight + 10;
  };

  // 7. Risk Assessment and Priority Areas
  const addRiskAssessmentSection = () => {
    if (y + 60 > 280) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(16);
    addHeading('Risk Assessment & Priority Areas');
    y += 2;
    doc.setFontSize(13);

    const riskInsights = [];

    // Identify high-risk metrics based on low safety scores
    const highRiskMetrics = Object.entries(data.safetyScoreDistribution)
      .filter(([_, score]) => score < 50)
      .sort((a, b) => a[1] - b[1]) // Sort by lowest score
      .slice(0, 3); // Take top 3

    if (highRiskMetrics.length > 0) {
      const highRiskNames = highRiskMetrics
        .map(([metric]) => metric)
        .join(', ');
      riskInsights.push(
        `Top high-risk areas: ${highRiskNames}. Immediate intervention is recommended.`
      );
    }

    // Focus on critical incidents for priority action
    if (data.criticalIncidents > 0) {
      riskInsights.push(
        `${data.criticalIncidents} critical incidents have occurred. These areas should be prioritized for investigation and corrective action.`
      );
    }

    // Prioritize areas with the most significant decline in compliance
    const areasToImprove = data.top3?.declinedMetrics || [];
    if (areasToImprove.length) {
      const worstMetrics = areasToImprove
        .map((metric) => metric.name)
        .join(', ');
      riskInsights.push(
        `Declining metrics: ${worstMetrics}. Urgent review and corrective measures needed.`
      );
    }

    // Insert the insights as bullet points
    riskInsights.forEach((text) => {
      const lines = doc.splitTextToSize(`• ${text}`, 180);
      doc.text(lines, margin, y);
      y += lines.length * 6;
    });

    y += 10;
  };

  addRiskAssessmentSection();

  // 8. Overall Summary Section
  const addSummarySection = () => {
    if (y + 60 > 280) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(16);
    addHeading('Overall Summary');
    y += 2;
    doc.setFontSize(13);

    const summary = [];

    // Safety Score Analysis
    if (data.safetyScore >= 90) {
      summary.push(
        'Excellent safety standards. Continue to monitor performance and focus on maintaining these high standards.'
      );
    } else if (data.safetyScore >= 75) {
      summary.push(
        'Good compliance. However, there are areas with room for improvement. Regular reviews are recommended.'
      );
    } else {
      summary.push(
        'Compliance score is below optimal levels. Immediate action is needed in low-performing areas to avoid potential risks.'
      );
    }

    // Performance Trends Over Time
    if (data.trends?.length) {
      const latestTrend = data.trends[data.trends.length - 1];
      const previousTrend = data.trends[data.trends.length - 2];

      if (latestTrend.score > previousTrend.score) {
        summary.push(
          'Recent safety scores indicate an improvement. Continue to focus on maintaining this upward trend.'
        );
      } else if (latestTrend.score < previousTrend.score) {
        summary.push(
          'There has been a drop in recent scores. A review of safety protocols and training may be needed.'
        );
      } else {
        summary.push(
          'Safety scores have remained stable, which indicates consistency in safety practices.'
        );
      }
    } else {
      summary.push('No trends data available for analysis.');
    }

    // Score Distribution Insights
    if (Object.keys(data.safetyScoreDistribution).length > 0) {
      const lowPerformingMetrics = Object.entries(data.safetyScoreDistribution)
        .filter(([_, score]) => score < 70)
        .map(([metric]) => metric);

      if (lowPerformingMetrics.length) {
        summary.push(
          `Some metrics are underperforming. Low-performing metrics include: ${lowPerformingMetrics.join(', ')}. Further investigation required.`
        );
      } else {
        summary.push(
          'All metrics are performing well, with no significant low-performing areas.'
        );
      }
    } else {
      summary.push('No distribution data available for analysis.');
    }

    // Safety Score Distribution Summary
    if (data.safetyScoreDistribution) {
      const avgScore = (
        Object.values(data.safetyScoreDistribution).reduce(
          (acc, score) => acc + score,
          0
        ) / Object.values(data.safetyScoreDistribution).length
      ).toFixed(2);

      summary.push(
        `The average score across all compliance metrics is ${avgScore}. This indicates a balanced performance but warrants attention to areas below average.`
      );
    }

    // Incident Analysis
    if (data.totalIncidents > 0) {
      const criticalIncidentsText = `${data.criticalIncidents} critical incidents occurred.`;
      summary.push(
        criticalIncidentsText +
          ' These incidents need to be reviewed urgently for root causes and corrective actions.'
      );
    } else {
      summary.push(
        'No critical incidents were reported, which is a positive outcome.'
      );
    }

    // Recommendations for Immediate Focus
    if (data.safetyScore < 70) {
      summary.push(
        'Compliance score is currently low. Immediate focus should be on revising safety protocols, employee training, and enforcement of compliance rules.'
      );
    }

    // Compliance Declines Insights
    const declineMetrics = data.top3?.declinedMetrics || [];
    if (declineMetrics.length) {
      const worstDecliningMetrics = declineMetrics
        .map((metric) => metric.name)
        .join(', ');
      summary.push(
        `Declining performance observed in: ${worstDecliningMetrics}. These areas require urgent corrective measures.`
      );
    }

    summary.forEach((text) => {
      const lines = doc.splitTextToSize(`• ${text}`, 180);
      doc.text(lines, margin, y);
      y += lines.length * 6;
    });

    y += 10;
  };

  addSummarySection();

  // 9. Recommendations Section
  const addRecommendationsSection = () => {
    if (y + 60 > 280) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(16);
    addHeading('Recommendations');
    y += 2;
    doc.setFontSize(13);

    const recommendations = [];

    if (parseFloat(data.progress) < 50) {
      recommendations.push(
        'Progress under 50%. Recommend setting short-term targets and monitoring.'
      );
    }

    if (data.criticalIncidents > 0) {
      recommendations.push(
        `${data.criticalIncidents} critical incidents occurred. Risk mitigation is top priority.`
      );
    }

    if (data.top3?.declinedMetrics?.length) {
      const list = data.top3.declinedMetrics.map((d) => d.name).join(', ');
      recommendations.push(
        `Declines observed in: ${list}. Immediate corrective measures required.`
      );
    }

    recommendations.forEach((text) => {
      const lines = doc.splitTextToSize(`• ${text}`, 180);
      doc.text(lines, margin, y);
      y += lines.length * 6;
    });

    y += 10;
  };

  addRecommendationsSection();

  // 10. Graphs and Charts at the End
  doc.addPage(); // Start a fresh page for visuals
  y = margin; // Reset Y position

  doc.setFontSize(16);
  addHeading('Visual Insights');
  y += 6;

  // Now insert the visuals one by one
  //await addImageFromRef(snapshotRef, 'Snapshots');
  await addImageFromRef(trendsRef, 'Safety Trends Chart');
  await addImageFromRef(distributionRef, 'Score Distribution Chart');

  // 11. Save PDF
  doc.save(`${data.name || 'report'}-safety-report.pdf`);
}
