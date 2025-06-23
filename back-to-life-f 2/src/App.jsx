import MultiStepForm from "./components/MultiStepForm";

function App() {
  return (
    <div className="min-h-screen bg-white md:bg-gray-100">
      <div className="flex justify-center">
        <img src="/signature-recovery-score.png" alt="App Logo" className="h-auto w-auto mb-8" />
      </div>
      <MultiStepForm />
    </div>
  );
}

export default App;
