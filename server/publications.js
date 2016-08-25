/**
 * Created by thomas on 20/08/16.
 */

import { Meteor } from 'meteor/meteor';
import { Registered, Files } from '../both/collections';

Registered.serverTransform({
   picture: function(doc) {
      if(doc.picture && doc.picture.indexOf('/') === -1){
         return Files.find({_id: doc.picture}).fetch()[0].url(); // Not always update at time, need to reload the page to see result
      }
      return doc.picture;
   }
});

Meteor.publishTransformed('update', (id) => {
   return Registered.find({_id: id});
});