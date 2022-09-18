class ValidationError extends Error {}
class NotFoundError extends Error {}

function handleError(err, req, res, next) {
    if (err instanceof NotFoundError) {
        res
            .status(404)
            .render('error', {
                message: 'An item with the given ID could not be found.'
            });
        return;
    }

    res.status(err instanceof ValidationError ? 400 : 500);

    res.render('error', {
        message: err instanceof ValidationError ? err.message : 'Sorry, please try again later.',
    });
}

module.exports = {
    handleError,
    ValidationError,
    NotFoundError
}