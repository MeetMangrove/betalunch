/**
 * Created by thomas on 20/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { Registered } from '../both/collections';

Meteor.methods({
   exist(doc){
       return Registered.findOne({email: doc.email}) ? false : doc;
   }
});