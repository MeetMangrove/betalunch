/**
 * Created by thomas on 02/09/16.
 */

import { Registered, Files } from '../both/collections';
import { sendWelcomeMail } from '../server/main';

Files.allow({
    insert(user, doc) {
        return doc.size() < 1000000; // An alert is display if result is false
    },
    update(user, doc) {
        return doc.size() < 1000000;
    },
    download() {
        return true;
    },
    fetch: null
});

Registered.allow({
    insert(user, doc){
        sendWelcomeMail(doc);
        return true;
    },
    update(){
        return true; // There is not authentification system, so if someone delete all the database, we can restore a backup with mongoDB.
    },
    remove(){
        return true; // Same
    }
});