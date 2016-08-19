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
    insert() {
      return true;
    },
    update() {
        return true;
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
        optional: false
    },
    number: {
        type: String,
        optional: false
    },
    isPairedToday: {
        type: Boolean,
        defaultValue: false,
        optional: false
    },
    idPairedWeek: {
        type: Boolean,
        defaultValue: true,
        optional: false
    },
    picture: {
        type: String,
        autoform: {
            template: "bootstrap3",
            afFieldInput: {
                type: "cfs-file",
                collection: "files"
            }
        },
        optional: false
    },
    week: {
        type: [String],
        allowedValues: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        autoform: {
            type: "select",
            afFieldInput: {
                multiple: true
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
        return true;
    },
    remove(){
        return true;
    }
});

Registered.attachSchema(Schema);

export { Registered, Files, Schema };