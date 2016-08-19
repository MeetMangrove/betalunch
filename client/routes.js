/**
 * Created by thomas on 19/08/16.
 */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
    name: 'form',
    action(){
        BlazeLayout.render('main', { main: 'form' });
    }
});

FlowRouter.route('/accept/:_id', {
    name: 'accept',
    action(){
        BlazeLayout.render('main', { main: 'accept' });
    }
});

FlowRouter.route('/reject/:_id', {
    name: 'reject',
    action(){
        BlazeLayout.render('main', { main: 'reject' });
    }
});

FlowRouter.route('/rejectweek/:_id', {
    name: 'rejectweek',
    action(){
        BlazeLayout.render('main', { main: 'rejectweek' });
    }
});

FlowRouter.route('/unsubscribe/:_id', {
    name: 'unsubscribe',
    action(){
        BlazeLayout.render('main', { main: 'unsubscribe' });
    }
});