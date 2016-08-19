import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Registered } from '../both/collections';
import './main.html';

AutoForm.setDefaultTemplate('materialize');
AutoForm.addHooks(
    ["insertRegisteredForm"],
    {
        before   : {
            method: CfsAutoForm.Hooks.beforeInsert
        },
        after    : {
            method: CfsAutoForm.Hooks.afterInsert
        }
    }
);

Template.form.helpers({
  registered() {
    return Registered;
  }
});

Template.accept.onCreated(() => {
    Registered.update({_id: FlowRouter.getParam("_id")}, {$set: {isPairedToday: true}});
});

Template.reject_week.onCreated(() => {
    Registered.update({_id: FlowRouter.getParam("_id")}, {$set: {isPairedWeek: false}});
});

Template.change_pairing_days.onCreated(() => {
   this.subscribe = Meteor.subscribe('update_week', FlowRouter.getParam('_id'));
});

Template.change_pairing_days.helpers({
    currentUser(){
        return Registered.findOne({_id: FlowRouter.getParam('_id')});
    }
});

Template.unsubscribe.onCreated(() => {
    Registered.remove({_id: FlowRouter.getParam("_id")});
});


