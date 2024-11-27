Marvel Showdown

Marvel Showdown is an interactive superhero analytics and comparison tool that allows users to explore and compare superhero stats visually. The application features multiple interactive charts, including scatter plots, bar charts, pyramid charts, and heatmaps, to analyze and compare the powers of Marvel superheroes dynamically.

![Screen Recording 2024-11-23 at 9 07 43 PM](https://github.com/user-attachments/assets/9baadcfb-0f43-4425-b763-7f82915ec2f9)

Features
	•	Hero Stats Comparison:
	•	Compare two heroes head-to-head in a pyramid chart.
	•	Select heroes from dropdowns or search by name.
	•	Dynamic Visualizations:
	•	Interactive scatter plots, bar charts, and heatmaps.
	•	Real-time updates based on user input.
	•	Hero Filtering:
	•	Filter heroes by alignment (Good, Neutral, Bad).
	•	Toggle between stats dynamically.
	•	Interactive Animations:
	•	Smooth transitions and animations for visualizations.
	•	Data Insights:
	•	Visualize correlations between hero attributes.
	•	Analyze hero distributions across different alignments.

Technologies Used

Frontend:
	•	Next.js - React framework for server-side rendering and routing.
	•	D3.js - For creating data visualizations.
	•	React-Select - Custom dropdowns for hero selection.
	•	Tailwind CSS - For responsive and modern styling.

Backend:
	•	Node.js - JavaScript runtime for the server.
	•	MongoDB - NoSQL database for storing superhero stats.

Live Demo

Marvel Showdown - Live Site (Need to Deplot)

Setup and Installation

Prerequisites
	•	Node.js (v16 or higher)
	•	MongoDB (local or remote)

Steps
	1.	Clone the repository:

git clone https://github.com/your-username/marvel-showdown.git
cd marvel-showdown
	2.	Install dependencies:

npm install
	3.	Configure the environment variables:
	•	Create a .env.local file in the root directory.
	•	Add the following:

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/marvel-showdown-data?retryWrites=true&w=majority
	4.	Run the development server:
npm run dev
	5.	Open the application in your browser:

http://localhost:3000

Application Features

1. Hero Comparison
	•	Compare two heroes using a pyramid chart.
	•	Stat values are displayed on the bars for better clarity.
	•	Fully animated transitions for seamless updates.

2. Hero Distribution
	•	Bar Chart: Show hero alignment distribution (Good, Neutral, Bad).
	•	Scatter Plot: Analyze correlations between total stats and individual attributes.
	•	Heatmap: Explore correlations between hero stats visually.

3. Dynamic Filtering
	•	Filter heroes by alignment or specific stats.
	•	Toggle between different stat dimensions on scatter plots.

4. Hero Search
	•	Use React-Select dropdowns with search functionality to select heroes.

File Structure

marvel-showdown/
├── app/
│   ├── components/              # React components for visualizations
│   │   ├── HeroComparisonChart.jsx  # Pyramid chart for hero comparison
│   │   ├── HeroScatterPlot.jsx      # Scatter plot visualization
│   │   ├── HeroBarChart.jsx         # Bar chart for alignments
│   │   ├── HeroHeatmap.jsx          # Heatmap for correlations
│   ├── pages/
│   │   └── api/
│   │       └── getData.js           # API endpoint to fetch hero stats
├── public/                        # Static assets
│   ├── fonts/                     # Custom fonts
│   ├── bg1.jpg                    # Background image 1
│   ├── bg2.jpg                    # Background image 2
├── styles/                        # Global and component styles
│   └── globals.css                # Global CSS styles
├── .env.local                     # Environment variables
├── package.json                   # Project dependencies
└── README.md                      # Project documentation

Key Components

HeroComparisonChart.jsx
	•	Pyramid chart for comparing stats between two heroes.

HeroScatterPlot.jsx
	•	Scatter plot for analyzing individual hero stats and total power.

HeroBarChart.jsx
	•	Bar chart to display hero distribution by alignment.

HeroHeatmap.jsx
	•	Heatmap to show correlations between hero stats.

API Route
	•	/api/getData: Fetch hero stats from the MongoDB database.

Customization
	1.	Add New Stats:
	•	Update the stats array in the respective component to include additional fields.
	2.	Change Colors:
	•	Modify the colorScale in D3 to use a different color palette.
	3.	Update Background Images:
	•	Replace bg1.jpg or bg2.jpg in the public/ folder.

Future Improvements
	•	Add a team builder to compare teams of heroes instead of individual heroes.
	•	Include supervillains in the database for broader comparisons.
	•	Add tooltips to visualizations for better interactivity.

Contributing
	1.	Fork the repository.
	2.	Create a new branch:

git checkout -b feature/your-feature-name
	3.	Commit your changes:

git commit -m "Add your message here"
	4.	Push to the branch:

git push origin feature/your-feature-name
	5.	Open a pull request.

License
This project is licensed under the MIT License.
