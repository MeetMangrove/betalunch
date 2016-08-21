/**
 * Created by thomas on 18/08/16.
 */

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';

const Files = new FS.Collection("files", {
    stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
    insert(user, doc) {
      return doc.size() < 1000000; // TODO: explain what happens if uploaded doc.size() >= 1000000
    },
    update() {
        return true; // TODO: don't we need the same condition as above, if user updates their avatar?
    },
    download() {
        return true;
    },
    fetch: null
});

const Registered = new Mongo.Collection('registered');
const Schema = new SimpleSchema({
    name: {
        type: String,
        optional: false
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: false,
        autoform: {
            afFieldInput: {
                type: 'email'
            }
        }
    },
    number: {
        type: String,
        max: 12,
        optional: false,
        autoform: {
            type: 'tel',
            label: 'Mobile Phone'
        }
    },
    isPairedToday: { // TODO: what is field for? explain.
        type: Boolean,
        defaultValue: false,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                label: false
            },
            afFormGroup: {
                label: false
            }
        }
    },
    isPairedWeek: { // TODO: what is field for? explain.
        type: Boolean,
        defaultValue: true,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                label: false
            },
            afFormGroup: {
                label: false
            }
        }
    },
    picture: {
        type: String,
        autoform: {
            template: "bootstrap3",
            label: 'Profile Picture (less than 1M)',
            afFieldInput: {
                type: "cfs-file",
                collection: "files"
            }
        },
        optional: false
    },
    week: { // TODO: what is field for? explain.
        type: [String],
        allowedValues: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        autoform: {
            type: "select",
            label: 'Days of the week',
            afFieldInput: {
                multiple: true,
                firstOption: false,
                defaultValue: 'Monday'
            }
        },
        optional: false
    }
});

Registered.allow({
    insert(){
        return true;
    },
    update(){
        return true; // TODO: so every user can update every other user?
    },
    remove(){
        return true; // TODO: so every user can remove every other user?
    }
});

Registered.attachSchema(Schema);

export { Registered, Files, Schema };
