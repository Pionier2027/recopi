import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

// メインタグを表示するための関数コンポーネントを定義
const Navigation = () => {
    return ( 
        <Navbar bg="dark" variant="dark" className="mb-3">
            {/* メインページ */}
            <Navbar.Brand href="#home">Fridge Classifier</Navbar.Brand>
            <Nav className="mr-auto">
            {/* 画像を判定するメインページに移動 */}
            <Nav.Link href="/">Home</Nav.Link>
            {/* DBに保存されている食材を閲覧 */}
            <Nav.Link href="/list">Images</Nav.Link>
            {/* 献立をオススメしてくれるページを表示 */}
            <Nav.Link href="/menu">Menu</Nav.Link>
            </Nav>
        </Navbar>
     );
}
 
export default Navigation;