import React from 'react';
import { MainContent } from './pages/MainContent';
import { Navigation } from './components/Navigation';
import {Route, Routes} from 'react-router-dom'
import { ChartContent } from './pages/ChartContent';
import { TextSearch } from './pages/TextSearchPage';
import FileForm from './pages/SendFileForm';
import EditableTable from './pages/TagEditor'


function App() {
  return (
    <div className="container">
      <Navigation/>
      <Routes>
        <Route path='/' element={<MainContent/>}/>
        <Route path='/charts' element={<ChartContent/>}/>
        <Route path='/textsearch' element={<TextSearch/>}></Route>
        <Route path='/sendfile' element={<FileForm></FileForm>}></Route>
        <Route path='/tags' element={<EditableTable></EditableTable>}></Route>
      </Routes>
    </div>
    );
}

export default App;
