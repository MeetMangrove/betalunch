/**
 * Created by thomas on 20/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { Registered, Files } from '../both/collections';

Meteor.publish('update', (id) => {
   return Registered.find({_id: id});
});

Meteor.publish('image', (id) => {
   console.log(Registered.find({_id: id}).fetch()[0].picture);
   console.log(Files.find({_id: Registered.find({_id: id}).fetch()[0].picture }).fetch());
   return Files.find({_id: Registered.find({_id: id}).fetch()[0].picture });
});