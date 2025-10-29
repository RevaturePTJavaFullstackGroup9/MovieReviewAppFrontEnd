import React from 'react';

const ReviewsBox = ({reviews}) =>{

    return (<>
        <h2> Reviews </h2>
        <table>
            <thead>
                <tr>
                    <th>UserName</th>
                    <th>Review Score</th>
                    <th>Review Text</th>
                </tr>
            </thead>
            <tbody>
                {reviews.map(review => (
                    <tr>
                        <td>{review.userId}</td>
                        <>{(()=>{
                            if (review.isLiked){
                                return <td>👍</td>
                            }else{
                                return <td>👎</td>
                            }
                        })()}</>
                        <td>{review.reviewText}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    </>)
}

export default ReviewsBox;