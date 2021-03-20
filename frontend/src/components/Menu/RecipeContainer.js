import React from 'react';
import Recipe from './Recipe';

const RecipeContainer = props => {

    const displayRecipes = () => {
        
        return props.hits.map(hit => {
            return <Recipe key={hit.recipe.uri} recipe={hit.recipe}/>;
        });
    };

    return (
        <div>
            <p>Here are some recommended recipes</p>
            <section>{displayRecipes()}</section>
        </div>
    );
};

export default RecipeContainer;