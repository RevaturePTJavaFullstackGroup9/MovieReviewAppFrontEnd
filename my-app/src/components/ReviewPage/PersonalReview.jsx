import React from 'react';

const PersonalReview = () =>{

    return (<><div>
        <h3>Leave a review?</h3>
        <label htmlFor="personalReview">Your Review:</label><br/>
        <textarea id="personalReview" name="personalReview" defaultValue="If the user left a review, this will hold thier review for editing"></textarea>
        </div></>)
}

export default PersonalReview;