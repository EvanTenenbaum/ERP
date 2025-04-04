// Load dummy data into the application
import { loadDummyData } from '../dummy-data/data-loader';

// Create a button to load dummy data
export default function DataLoader() {
  const handleLoadData = async () => {
    try {
      const result = await loadDummyData();
      if (result.success) {
        alert('Dummy data loaded successfully! Please refresh the page to see the data.');
      } else {
        alert(`Failed to load data: ${result.message}`);
      }
    } catch (error) {
      alert(`Error loading data: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleLoadData}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg"
      >
        Load Dummy Data
      </button>
    </div>
  );
}
