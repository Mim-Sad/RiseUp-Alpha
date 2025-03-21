import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import MultiStepForm from './pages/MultiStepForm/MultiStepForm';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/form" element={<MultiStepForm />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;