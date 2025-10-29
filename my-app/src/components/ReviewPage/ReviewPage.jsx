import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewsBox from './ReviewsBox';
import Poster from './Poster';
import MovieInfoBox from './MovieInfoBox';
import PersonalReview from './PersonalReview';

const ReviewPage = () => {
    const {movieId} = useParams();

    const [reviews, setReviews] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [movie, setMovie] = React.useState(null);
    const [averageScore, setAverageScore] = React.useState(0.0);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        fetch(`http://localhost:8080/movies/${movieId}/reviews`)
        .then(response => response.json())
        .then(data => setReviews(data))
        .catch(e => console.error(`Error fetching reviews for movie of id ${movieId}, error = '${e}'`))
    }, [page])

    React.useEffect(() => {
        (async () => {
            try {
                let response = await fetch(`http://localhost:8080/api/movies/${movieId}`);
                let data = await response.json();
                setMovie(data);
            }
            catch (e) {
                console.error(`Error fetching movie of id ${movieId}, error='${e}'`)
            }
        })();
    }, [movieId]);

    React.useEffect(() => {
        fetch(`http://localhost:8080/movies/${movieId}/average_score`)
        .then(response => response.json())
        .then(data => setAverageScore(data))
        .catch(e => console.error(`Error fetching average score for movie of id ${movieId} , error = '${e}'`))
    }, [movieId]);

    return (
        <>
        <h1>Review Page for movie {movieId} </h1>
        <table>
            <tbody>
            <tr>
                <td><Poster movie={movie}/></td>
                <td><MovieInfoBox movie={movie} averageScore={averageScore}/></td>
            </tr>
            <tr>
                <td><PersonalReview movieId={movieId} userId={null}/></td>
                <td><ReviewsBox reviews={reviews}/></td>
            </tr>
            </tbody>
        </table>
        </>
    )
}

export default ReviewPage;