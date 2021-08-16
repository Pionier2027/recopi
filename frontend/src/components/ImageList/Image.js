import React from 'react';
import { Card, Col } from 'react-bootstrap';

// DB上の各レコードを表示するための関数コンポーネント
const Image = (props) => {
    return ( 
        <Col>
            <Card style={{ width: '18rem' }} className="mx-auto mb-2">
            {/* 判定画像を表示 */}
            <Card.Img variant="top" src={props.pic} />
            {/* 画像の判定名を表示 */}
            <Card.Body>
                <Card.Title>Classified as: {props.name}</Card.Title>
            </Card.Body>
            </Card>  
        </Col>  
     );
}
 
export default Image;