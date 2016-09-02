/**
 * Created by thomas on 18/08/16.
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';

const Files = new FS.Collection("files", {
    stores: [new FS.Store.GridFS("filesStore")]
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
        max: 18,
        optional: false,
        autoform: {
            type: 'tel',
            label: 'Phone number'
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
    onMonday: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    onTuesday: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    onWednesday: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    onThursday: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    onFriday: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    lastPairing: { // ID of the last person with whom we have paired.
        type: String,
        optional: true
    },
    isPairedToday: { // Boolean to know if this person accepted to be paired today.
        type: Boolean,
        defaultValue: false,
        optional: true
    },
    isPairedWeek: { // Boolean to know if this person accepted to be paired this week.
        type: Boolean,
        defaultValue: true,
        optional: true
    }
});

Registered.attachSchema(Schema);

export { Registered, Files, Schema };
