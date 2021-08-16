import React from 'react';
import './App.css';
import Classifier from './components/Classifier/Classifier';
import ImageList from './components/ImageList/ImageList';
import Menu from './components/Menu/Menu';
import Navigation from './components/Navigation/Navigation';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className='App'>
        <Switch> 
          {/* 食材分類のメインページ */}
          <Route exact path='/' component={Classifier} />
          {/* 冷蔵庫に保管された食材リスト */}
          <Route exact path='/list' component={ImageList} />
          {/* 献立オススメのページ */}
          <Route exact path='/menu' component={Menu} />
          {/* それ以外のURLが指定された場合メインページに飛ぶよう指定 */}
          <Route exact path='*' component={Classifier} /> 
        </Switch>
      </div>
    </BrowserRouter>
  );
}
export default App;
