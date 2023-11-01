import React from 'react';
import { MainContent } from './pages/MainContent';
import { Navigation } from './components/Navigation';
import {Route, Routes} from 'react-router-dom'
import { ChartContent } from './pages/ChartContent';
import { TextSearch } from './pages/TextSearchPage';
import FileForm from './components/SendFileForm';


function App() {
  return (
    <div className="container">
      <Navigation/>
      <Routes>
        <Route path='/' element={<MainContent/>}/>
        <Route path='/charts' element={<ChartContent/>}/>
        <Route path='/textsearch' element={<TextSearch/>}></Route>
        <Route path='/sendfile' element={<FileForm></FileForm>}></Route>
      </Routes>
    </div>
    );
}

export default App;
