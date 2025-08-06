# Automation Waste Calculator

A modern web application to help organizations and individuals quantify the financial impact of manual administrative activities and understand the potential cost savings from automation investments.

## Features

### 🎯 Core Features
- **Activity Input Form**: Add manual tasks with frequency, duration, and cost details
- **Cost Calculations**: Automatic calculation across different time periods (weekly, monthly, annual)
- **Visual Analytics**: Interactive charts showing cost breakdowns and trends
- **ROI Calculator**: Model automation investments with payback period analysis
- **Activity Management**: Add, remove, and organize multiple activities

### 💡 Key Capabilities
- Real-time cost calculations as you type
- Multiple time interval support (hourly, daily, weekly, monthly)
- Activity categorization and organization
- Comprehensive ROI analysis with visual indicators
- Local storage persistence
- Responsive design for desktop and mobile

### 📊 Visualizations
- Cost breakdown by time periods (bar chart)
- Cost distribution by activities (pie chart)
- ROI metrics with color-coded indicators
- Progress bars for efficiency improvements

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **UI Components**: ShadCN/UI with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with Notion-inspired design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd automation-waste-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Activities

1. **Activity Name**: Describe the manual task (e.g., "Weekly expense reports")
2. **Category**: Select from predefined categories or use "Other"
3. **Frequency**: How often the task occurs
4. **Interval**: Time period (hourly, daily, weekly, monthly)
5. **Duration**: How long each task takes (in hours)
6. **Hourly Rate**: Cost per hour of the person doing the task

### Understanding Results

- **Metrics Cards**: Quick overview of weekly, monthly, and annual costs
- **Cost Breakdown Charts**: Visual representation of costs across time periods and activities
- **ROI Calculator**: Input automation costs and efficiency improvements to see potential savings
- **Activity Table**: Detailed breakdown of all activities with sorting capabilities

### ROI Analysis

The ROI calculator helps you model automation investments by:
- Setting the upfront automation cost
- Defining efficiency improvement percentage
- Calculating annual savings, ROI percentage, and payback period
- Providing visual indicators for investment quality

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            
│   ├── ui/                # ShadCN UI components
│   ├── ActivityForm/      # Form components for adding activities
│   ├── ResultsDashboard/  # Results display components
│   ├── Charts/           # Chart and visualization components
│   └── Layout/           # Layout components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and calculations
└── lib/                  # Library configurations
```

## Key Components

- **`ActivityForm`**: Form for adding new activities with validation
- **`MetricsCards`**: Summary cards showing key cost metrics
- **`ActivityTable`**: Sortable table of all activities
- **`CostBreakdownChart`**: Bar and pie charts for cost visualization
- **`ROICalculator`**: Interactive ROI analysis tool

## Calculations

The app uses the following formulas:

### Cost Calculations
- **Cost per Activity** = Duration (hours) × Hourly Rate
- **Weekly Cost** = (Frequency × Cost per Activity) × conversion factor
- **Monthly Cost** = Weekly Cost × 4.33
- **Annual Cost** = Weekly Cost × 52

### ROI Analysis
- **Annual Savings** = Annual Cost × (Efficiency Improvement %)
- **ROI** = ((Annual Savings - Automation Cost) ÷ Automation Cost) × 100
- **Payback Period** = Automation Cost ÷ (Annual Savings ÷ 12) months

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.