export function validatorPost(request, response, next) {
    //if the to-do doesnt have title or description which are mandatory params
    if(!request.body.title || !request.body.description) {
        return response.status(400).send({
            message: "Missing Information"
        });
    }
    next();
}

export function validatorID(request, response, next) {
    const { id } = request.params;
    if (!id.match(/\d+/)) {
        return response.status(406).send({
            message: "The ID has to be an integer number"
        });
    }
    next();
}