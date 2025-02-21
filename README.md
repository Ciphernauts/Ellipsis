# Ellipsis

A real-time safety compliance monitoring system designed to detect and address construction site hazards using computer vision developed by The Ciphernauts. The system features a website and mobile app, both equipped with dashboards, for real-time monitoring and reporting.

### YOLOv11x Object Detection Classes By Phase:

- **Phase 1 (PPE Detection)**: Person, Helmet, No Helmet, Vest, No Vest, Glove, No Glove, Shoe, No Shoe
- **Phase 2 (Fall Protection Monitoring)**: Person, Harness, No Harness, Guardrail, Good Scaffolding, Damaged Scaffolding

More details about YOLOv11x: https://docs.ultralytics.com/models/yolo11/#performance-metrics 

**Note**: This repository currently focuses exclusively on the website and mobile app components of the project. Computer vision/object detection is being run on Google Colab. 

## Tech Stack

- **Frontend**: React, PWA
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, MongoDB
- **Linting & Formatting**: ESLint, Prettier
- **Computer Vision**: YOLOv11x

## Setup

### Clone

   ```bash
   git clone https://github.com/Mariah0-0/Ellipsis.git
   cd Ellipsis
   ```

### Install Dependencies

1. **Frontend**

   ```bash
   cd client
   npm install
   ```

2. **Backend**

   ```bash
   cd server
   npm install
   ```

### Run

1. **Frontend**

   ```bash
   cd client
   npm run dev
   ```

2. **Backend**

   ```bash
   cd server
   npm run dev
   ```
