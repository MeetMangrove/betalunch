import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Registered } from '../both/collections';
import './main.html';

AutoForm.setDefaultTemplate('materialize');

Template.form.onCreated(function helloOnCreated() {

});

Template.form.helpers({
  registered() {
    return Registered;
  }
});

Template.form.events({

});


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
