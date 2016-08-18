/**
 * Created by thomas on 18/08/16.
 */

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Files = new FS.Collection("files", {
    stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
    download: function () {
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
    /*picture: {
        type: String,
        autoform: {
            afFieldInput: {
                type: "cfs-file",
                collection: "files"
            }
        },
        optional: false
    },*/
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
    }
});

Registered.attachSchema(Schema);

export { Registered, Files, Schema };