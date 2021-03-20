import React from 'react';

const Recipe = (props) => {
    console.log("pass",props.recipe)
    return (
        <div>
            <hr></hr>
            <p>{props.recipe.label}</p>
            <p>Calories: {Math.round(props.recipe.calories * 10) / 10}kcal</p>
            <a href={props.recipe.url}>
            <img
                 src={props.recipe.image}
                 alt="Recipe"
            /></a>
        </div>
    );
};

export default Recipe;