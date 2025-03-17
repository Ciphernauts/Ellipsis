const getAdminDashboardData = `
SELECT json_build_object(
    'totalusers', (SELECT COUNT(*) AS count FROM users),
    'activeconstructionsites', (SELECT COUNT(*) FROM construction_sites WHERE status='Active'),
    'activecameras', 1,
    'avgincidentresolutiontime', 3
);
`;

module.exports = {
  getAdminDashboardData,
};
