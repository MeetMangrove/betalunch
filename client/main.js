import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Registered, Files } from '../both/collections';
import './main.html';

AutoForm.setDefaultTemplate('materialize');
AutoForm.hooks({
    insertRegisteredForm: {
        before: {
            insert(doc) {
                const file = $('[data-schema-key="picture"]')[0].files[0];
                if(file && file.size >= 1000000){
                    alert('Your profile picture is too big, you need to have one smaller than 1M.');
                }
                Meteor.call('exist', doc, (err, res) => {
                    if(err){
                        console.log(err);
                    }else{
                        if(!res)
                            alert('Email already exist.');
                        this.result(res);
                    }
                });
            }
        },
        after: {
            insert(err) {
                if(err){
                    console.log(err);
                    alert(err);
                }else{
                    alert('You are registered ! You’ll receive your first invitation for a betalunch tomorrow morning at 9am!')
                }
            }
        }
    },
    updatePairingDays: {
        before: {
            update(doc){
                const file = $('[data-schema-key="picture"]')[0].files[0];
                if(file && file.size >= 1000000){
                    alert('Your profile picture is too big, you need to have one smaller than 1M.');
                }
                return doc;
            }
        },
        after: {
            update(err) {
                if(err){
                    console.log(err);
                    alert(err);
                }else{
                    alert('Your account have been updated !');
                    location.reload(); //Reload the page to load the image
                }
            }
        }
    }
}, true);

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
    this.subsProfile = Meteor.subscribe('update', FlowRouter.getParam('_id'));
    this.subsImage = Meteor.subscribe('image', FlowRouter.getParam('_id'));
});

Template.change_pairing_days.helpers({
    currentUser(){
        return Registered.findOne({_id: FlowRouter.getParam('_id')});
    },
    registered() {
        return Registered;
    },
    image(){
        const data = Registered.findOne({_id: FlowRouter.getParam('_id')});
        return data ? data.picture : null;
    }
});

Template.unsubscribe.onCreated(() => {
    Registered.remove({_id: FlowRouter.getParam("_id")});
});

