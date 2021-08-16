import React from 'react';
import Recipe from './Recipe';
import { Row } from 'react-bootstrap';

// オススメレシピを表示するためのコンテナを関数コンポーネントで定義
const RecipeContainer = props => {

    const displayRecipes = () => {

        // 各レシピを画面に表示するためのコンポーネントをマッピング
        return props.hits.map(hit => {
            return <Recipe key={hit.recipe.uri} recipe={hit.recipe}/>;
        });
    };
    console.log(props.hits)

    return (
        <div>
            <p style={{paddingTop: '25px'}}>Here are some recommended recipes</p>
            <Row xs={1} md={3} className="g-4">
                {displayRecipes()}
            </Row>
        </div>
    );
};

export default RecipeContainer;