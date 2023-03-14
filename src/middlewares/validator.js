export function validator(request, response, next) {
    //if the to-do doesnt have title or description which are mandatory params
    if(!request.body.title || !request.body.description) {
        return response.status(400).send({
            message: "Missing Information"
        });
    }
    next();
}