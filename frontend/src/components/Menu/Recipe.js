import React from 'react';
import { Col, Card } from 'react-bootstrap';

const Recipe = (props) => {
    console.log("pass",props.recipe)
    return (
        <Col>
            <Card style={{ width: '18rem' }} className="mx-auto mb-2">
                {/* レシピ名を表示 */}
                <Card.Title>{props.recipe.label}</Card.Title>
                {/* カロリー表示をキロ単位に変換し、小数点以下一桁までを表示 */}
                <Card.Body>Calories: {Math.round(props.recipe.calories * 10) / 10}kcal</Card.Body>
                {/* レシピのサムネイル画像を表示し、クリックすると詳細ページへと移動 */}
                <a href={props.recipe.url}>
                    <Card.Img variant="top" src={props.recipe.image} alt="Sorry, no image available. Please click to check the details"/>
                </a>
            </Card>  
        </Col>  
    );
};

export default Recipe;