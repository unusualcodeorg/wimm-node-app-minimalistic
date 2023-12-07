import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import contact from './contact'
import topic from './topic'
import topics from './topics'

const router = express.Router();

/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
router.use('/contact', contact);
router.use('/topic', topic);
router.use('/topics', topics);

export default router;
