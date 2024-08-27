import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import AddCaption from './pages/AddCaption';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/add-caption" element={<AddCaption />} />
      </Routes>
    </Router>
  );
};

export default App;
