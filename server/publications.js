/**
 * Created by thomas on 20/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { Registered, Files } from '../both/collections';

Meteor.publish('update', (id) => {
   return Registered.find({_id: id});
});

Meteor.publish('image', (id) => {
   return Files.find({_id: id});
});