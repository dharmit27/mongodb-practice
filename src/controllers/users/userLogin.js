import usersModel from '../../models/user.js';
import bcrypt from 'bcryptjs'
import { generateJwt } from './user.services.js';

export default async (req, res, next) => {

    // Check for Proper Parameters Passed
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
            responseCode: 0,
            responseMessage: 'Please provide username and password',
            responseObject: []
        });

    }

    try {
        const user = await usersModel.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).send({
                responseCode: 0,
                responseMessage: 'Wrong Credentials',
                responseObject: []
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(400).send({
                responseCode: 0,
                responseMessage: 'Wrong Credentials',
                responseObject: []
            });
        }

        const token = await generateJwt({ userId: user._id });

        return res.status(200).send({
            responseCode: 1,
            responseMessage: "Success",
            responseObject: {
                user: {
                    name: user.name,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            responseCode: 0,
            responseMessage: 'Internal Server Error',
            responseObject: error
        });

    }
}