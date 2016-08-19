/**
 * Created by thomas on 20/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { Registered } from '../both/collections';

Meteor.publish('update_week', (id) => {
   return Registered.find({_id: id});
});