// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import IncidentModal from './IncidentModal';

// const socket = io('http://localhost:3000'); // Adjust the URL as needed

// const IncidentListener = () => {
//   const [incident, setIncident] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const handleNewIncident = (data) => {
//       const incidentData = JSON.parse(data.message);
//       setIncident(incidentData);
//       setModalOpen(true);
//     };

//     socket.on('newIncident', handleNewIncident);

//     return () => {
//       socket.off('newIncident', handleNewIncident);
//     };
//   }, []);

//   const closeModal = () => {
//     setModalOpen(false);
//     setIncident(null);
//   };

//   return (
//     <>
//       {isModalOpen && (
//         <IncidentModal incident={incident} onClose={closeModal} />
//       )}
//     </>
//   );
// };

// export default IncidentListener;
