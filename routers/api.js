const {Router} = require("express");
const {UserRecord} = require("../records/user.record");
const {ValidationError, NotFoundError} = require("../utils/errors");
const DOMPurify = require('isomorphic-dompurify');
const {appSecretHash, createHash, sessionCookieName, sessionMiddleware} = require('../utils/session');

const apiRouter = Router();

apiRouter

    .get('/', async (req, res) => {
        await sessionMiddleware(req, res, async () => {

            const role = DOMPurify.sanitize(req.query.role);
            const usersList = await (
                role ? UserRecord.listAllWithRole(role) : UserRecord.listAll()
            );

            res.render('api/users', {
                usersList,
            })
        });
    })

    .get('/forms/role', async (req, res) => {
        await sessionMiddleware(req, res, async () => {

            res.render('api/forms/role')

        });
    })

    .get('/:id', async (req, res) => {

        await sessionMiddleware(req, res, async () => {
            const user = await UserRecord.getOne(req.params.id);

            if (!user) {
                throw new NotFoundError();
            }

            res.render('api/user', {
                user,
            });
        });
    })

    .post('/', async (req, res) => {

        await sessionMiddleware(req, res, async () => {
            const user = new UserRecord(req.body);
            await user.insert();

            res
                .status(201)
                .render('api/added', {
                    user,
                })
        });
    })

    .post('/authenticate', async (req, res) => {
        const passwordHash = createHash(req.body.password);

        if (appSecretHash === passwordHash) {

            res
                .status(200)
                .cookie(sessionCookieName, appSecretHash, {
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60
                })
                .redirect('/api');
        } else {

            res
                .status(401)
                .redirect('/login');
        }
    })

    .patch('/:id', async (req, res) => {

        await sessionMiddleware(req, res, async () => {

            const user = await UserRecord.getOne(req.params.id);

            if (user === null) {
                throw new ValidationError('The user with the given ID was not found.');
            }

            Object.keys(req.body).forEach((userField) => {
                if (userField !== 'id') {
                    user[userField] = DOMPurify.sanitize(req.body[userField]);
                }
            });

            await user.update();

            res
                .status(200)
                .render('api/modified', {
                    user,
                });
        });
    })

    .delete('/:id', async (req, res, next) => {

        await sessionMiddleware(req, res, async () => {
            const {id} = req.params;
            const user = await UserRecord.getOne(id);
            if (!user) throw new ValidationError('There is no such user.');

            await user.delete();
            res
                .status(200)
                .render('api/deleted', {
                    user
                });
        });
    })

    .get('/forms/add', async (req, res) => {
        await sessionMiddleware(req, res, async () => {
        res.render('api/forms/add');
        });
    })

    .get('/forms/edit/:id', async (req, res) => {
        await sessionMiddleware(req, res, async () => {
            const user = await UserRecord.getOne(req.params.id);

            if (!user) {
                throw new ValidationError();
            }

            res.render('api/forms/edit', {
                user,
            });
        });
    })


module.exports = {
    apiRouter,
}