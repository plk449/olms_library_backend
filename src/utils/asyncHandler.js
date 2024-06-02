const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }

// const asyncHandler = () => {
//     () => { }  //function j parameter hisabe  function nibe take higher order function bolbo
// };