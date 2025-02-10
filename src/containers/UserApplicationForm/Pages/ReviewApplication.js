const ReviewApplication = ({review}) => {
    return ( 
        <div>
            {review.map(r=>{
                return(
                    <div>{r.label}</div>
                )
            })}
        </div>
     );
}
 
export default ReviewApplication;