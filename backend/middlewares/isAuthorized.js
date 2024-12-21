

const isAuthorized = (...roles) => {
    try {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(400).json({ mssg: `${req.user.role} is not allowed to access this resource` })
            }
            next();
        };
    }
    catch (error) {
        console.log(error);
    }
}


export default isAuthorized