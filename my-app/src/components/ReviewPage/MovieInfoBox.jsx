import React from 'react';

const MovieInfoBox = ({movie, averageScore}) =>{

    return (<>
        <table>
            <tbody>
                <tr>
                    <td>Average Score = {averageScore}</td>
                </tr>
                <tr>
                    <td>Movie Info: {movie?.title}</td>
                </tr>
            </tbody>
        </table>
    </>)
}

export default MovieInfoBox;