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
import mentor from './mentor';
import mentors from './mentors';
import content from './content';
import contents from './contents';
import subscription from './subscription';
import storage from './storage';
import profile from './profile';
import metascrap from './metascrap';

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
router.use('/mentor', mentor);
router.use('/mentors', mentors);
router.use('/content', content);
router.use('/contents', contents);
router.use('/subscription', subscription);
router.use('/storage', storage);
router.use('/profile', profile);
router.use('/meta', metascrap);

export default router;
